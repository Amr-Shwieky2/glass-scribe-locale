/**
 * @fileoverview Vite Dev Server API Plugin
 * @description Handles /api/* routes locally during development.
 * In production, Vercel serverless functions handle these routes.
 * 
 * BODY PARSING: Uses a dedicated JSON body-parsing middleware registered
 * BEFORE Vite's internal middlewares (via the `configureServer` return hook)
 * so the raw body is captured before anything else touches the stream.
 */

import type { Plugin, Connect } from 'vite';
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

// =============================================================================
// EXTENDED REQUEST TYPE (body stored by our json middleware)
// =============================================================================

interface JsonRequest extends IncomingMessage {
  body?: Record<string, unknown>;
}

// =============================================================================
// LOAD .env.local INTO process.env (server-side only)
// =============================================================================

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

// =============================================================================
// CLOUDINARY (lazy loaded)
// =============================================================================

let cld: typeof import('cloudinary').v2 | null = null;

async function getCloudinary() {
  if (!cld) {
    const mod = await import('cloudinary');
    cld = mod.v2;
    cld.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cld;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE_FOLDER = process.env.CLOUDINARY_BASE_FOLDER || 'shwaki-glassworks';

const VALID_CATEGORIES = [
  'shower-enclosures', 'glass-railings', 'mirrors', 'storefronts',
  'partitions', 'lobbies', 'backsplashes', 'shelves', 'glass-doors', 'hero',
];

// =============================================================================
// JSON BODY-PARSING MIDDLEWARE
// =============================================================================

/**
 * Simple JSON body parser for /api/* POST requests.
 * Collects the raw body from the stream and parses it as JSON.
 * Stores the result on `req.body` for downstream handlers.
 */
function jsonBodyParser(req: JsonRequest, _res: ServerResponse, next: Connect.NextFunction) {
  const url = req.url || '';

  // Only parse POST requests to /api/*
  if (req.method !== 'POST' || !url.startsWith('/api/')) {
    return next();
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    req.body = {};
    return next();
  }

  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf-8');
    try {
      req.body = raw ? JSON.parse(raw) : {};
    } catch {
      req.body = {};
    }
    next();
  });

  req.on('error', () => {
    req.body = {};
    next();
  });
}

// =============================================================================
// HELPERS
// =============================================================================

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function checkAuth(req: IncomingMessage): boolean {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return false;
  return h.substring(7) === process.env.ADMIN_TOKEN;
}

// =============================================================================
// POST /api/auth/login
// =============================================================================

async function handleLogin(req: JsonRequest, res: ServerResponse) {
  console.log('[Dev API] Login request received');
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const pw = process.env.ADMIN_PASSWORD;
  const tk = process.env.ADMIN_TOKEN;
  if (!pw || !tk) {
    console.error('[Dev API] Admin not configured — check .env.local');
    return json(res, 500, { error: 'Admin not configured. Check .env.local' });
  }

  const body = req.body || {};
  const password = body.password as string | undefined;
  console.log('[Dev API] Body parsed, password present:', !!password);

  if (!password) return json(res, 400, { error: 'Password is required' });

  const h1 = createHash('sha256').update(password).digest('hex');
  const h2 = createHash('sha256').update(pw).digest('hex');

  if (h1 !== h2) {
    console.log('[Dev API] Invalid password');
    return json(res, 401, { error: 'Invalid password' });
  }

  console.log('[Dev API] Login success ✅');
  json(res, 200, { success: true, token: tk });
}

// =============================================================================
// GET /api/cloudinary/images
// =============================================================================

async function handleImages(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  try {
    const c = await getCloudinary();
    const url = new URL(req.url || '', 'http://localhost');
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const all = url.searchParams.get('all');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const cursor = url.searchParams.get('cursor');

    let expression = `folder:${BASE_FOLDER}/*`;
    if (category && VALID_CATEGORIES.includes(category)) {
      expression = `folder:${BASE_FOLDER}/${category}`;
    }
    if (featured === 'true') expression += ' AND tags=featured';
    if (all === 'true') expression = `folder:${BASE_FOLDER}/*`;

    let search = c.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(limit)
      .with_field('tags')
      .with_field('context');

    if (cursor) search = search.next_cursor(cursor);

    const result = await search.execute();
    json(res, 200, {
      resources: result.resources || [],
      next_cursor: result.next_cursor,
      total_count: result.total_count,
    });
  } catch (error) {
    console.error('[Dev API] Cloudinary fetch error:', error);
    json(res, 500, { error: 'Failed to fetch images' });
  }
}

// =============================================================================
// POST /api/cloudinary/delete
// =============================================================================

async function handleDelete(req: JsonRequest, res: ServerResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!checkAuth(req)) return json(res, 401, { error: 'Unauthorized' });

  try {
    const c = await getCloudinary();
    const body = req.body || {};
    const publicId = body.publicId as string;
    if (!publicId) return json(res, 400, { error: 'Missing publicId' });

    const result = await c.uploader.destroy(publicId);
    if (result.result !== 'ok') return json(res, 400, { error: 'Failed to delete', result: result.result });

    json(res, 200, { success: true, publicId });
  } catch (error) {
    console.error('[Dev API] Delete error:', error);
    json(res, 500, { error: 'Failed to delete image' });
  }
}

// =============================================================================
// POST /api/cloudinary/tag
// =============================================================================

async function handleTag(req: JsonRequest, res: ServerResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!checkAuth(req)) return json(res, 401, { error: 'Unauthorized' });

  try {
    const c = await getCloudinary();
    const body = req.body || {};
    const { publicId, tag, action } = body as { publicId: string; tag: string; action: string };

    if (!publicId) return json(res, 400, { error: 'Missing publicId' });
    if (!tag) return json(res, 400, { error: 'Missing tag' });
    if (!['add', 'remove'].includes(action)) return json(res, 400, { error: 'Invalid action' });

    const result = action === 'add'
      ? await c.uploader.add_tag(tag, [publicId])
      : await c.uploader.remove_tag(tag, [publicId]);

    json(res, 200, { success: true, publicId, tag, action, result });
  } catch (error) {
    console.error('[Dev API] Tag error:', error);
    json(res, 500, { error: 'Failed to update tag' });
  }
}

// =============================================================================
// API ROUTER MIDDLEWARE
// =============================================================================

function apiRouter(req: JsonRequest, res: ServerResponse, next: Connect.NextFunction) {
  const url = req.url || '';

  // Health check
  if (url === '/api/health') {
    return json(res, 200, {
      status: 'ok',
      env: !!process.env.ADMIN_PASSWORD,
      cloud: process.env.CLOUDINARY_CLOUD_NAME || null,
    });
  }

  // CORS preflight
  if (req.method === 'OPTIONS' && url.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // Route matching
  const handle = (handler: (req: JsonRequest, res: ServerResponse) => Promise<void>) => {
    handler(req, res).catch((e) => {
      console.error('[Dev API] Unhandled error:', e);
      json(res, 500, { error: 'Internal server error' });
    });
  };

  if (url.startsWith('/api/auth/login'))       return handle(handleLogin);
  if (url.startsWith('/api/cloudinary/images')) return handle(handleImages);
  if (url.startsWith('/api/cloudinary/delete')) return handle(handleDelete);
  if (url.startsWith('/api/cloudinary/tag'))    return handle(handleTag);

  next();
}

// =============================================================================
// PLUGIN EXPORT
// =============================================================================

export default function devApiPlugin(): Plugin {
  return {
    name: 'shwaki-dev-api',
    configureServer(server) {
      // Register body parser + router BEFORE Vite's internal middleware
      // by returning a function from configureServer (post hook).
      // Actually we need it BEFORE Vite transforms, so use server.middlewares.use directly.
      // The key: register json body parser first, then the router.
      server.middlewares.use(jsonBodyParser);
      server.middlewares.use(apiRouter);

      console.log('\n  ✅ Dev API routes active:');
      console.log('     POST /api/auth/login');
      console.log('     GET  /api/cloudinary/images');
      console.log('     POST /api/cloudinary/delete');
      console.log('     POST /api/cloudinary/tag');
      console.log('     GET  /api/health\n');
    },
  };
}
