# Shwaki Brothers Glassworks

Website for **Shwaki Brothers Glassworks** (אחים שוואקי זכוכית), a glass installation business in Israel. Live at <https://www.shwakiglassworks.com>.

- **Next.js 16 (App Router)** + React 19 + TypeScript + Tailwind CSS
- **4 languages:** Hebrew (default, RTL), English, Arabic (RTL), Russian. Every page lives under `/[lang]/…`
- **Hosting:** Vercel
- **Images:** Cloudinary, fetched on the server and cached for 1 hour, with an admin panel at `/he/admin`
- **Leads:** contact form sends to Telegram
- **Ask AI:** home-page search with instant results from site content and short AI answers (Claude)
- **Chat assistant:** "Ask us" chat on every page — grounded answers, follow-up questions, and quote requests sent to Telegram after the visitor confirms

## Quick start

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000 → redirects to /he
```

```bash
npm run build && npm run start   # production build + server
```

## Project structure

```
app/
  [lang]/                  # every page; layout validates lang (he|en|ar|ru), unknown → 404
    page.tsx               # home
    [slug]/                # service landing pages (/he/glass-shower-installation) + city pages (/he/jerusalem)
    services/[serviceId]/  # legacy URL → 308 redirect to the service landing page
    blog/[slug]/ …         # other pages
    not-found.tsx          # localized 404
  global-not-found.tsx     # 404 for URLs outside /[lang] (e.g. /xx)
  api/
    ask/                   # Ask AI (streams a Claude answer)
    chat/                  # chat assistant (NDJSON stream + quote tool)
    chat/lead/             # visitor-confirmed quote request → Telegram
    search-index/[lang]/   # static per-language search corpus (built at build time)
    telegram/send/         # contact form → Telegram
    csrf/token/            # CSRF tokens for the contact form
    auth/{login,logout,session}/  # admin session (httpOnly cookie)
    cloudinary/{images,delete,tag,revalidate}/
    reviews/               # Google Places rating + reviews (cached 24h)
  sitemap.ts, robots.ts    # the only sitemap/robots (no files in /public)
src/
  data/                    # ALL content, per language; data/seo.ts = buildPageMetadata() (title, canonical, hreflang)
  views/                   # page views (Server Components; get `locale` from the route)
  components/              # UI; 'use client' only for interactive parts
  lib/
    i18n.ts                # locales, RTL, assertLocale()
    google-places.ts       # single source of truth for the rating (omitted when unavailable)
    cloudinary/server.ts   # cached server-side Cloudinary search + input whitelists
    rate-limit.ts          # Upstash Redis limiter (in-memory fallback)
    ai.ts                  # shared AI route guards: client, same-origin, limits, fallbacks
    telegram.ts            # Telegram sending: HTML with escaping, plain-text retry
    business-hours.ts      # open/closed in Israel time (OPENING_HOURS in data/contact.ts)
    admin-session.ts, csrf.ts, signed-token.ts
    search/                # search corpus, tokenizer (he/ar prefixes), retrieval, AI prompts (ask + chat)
```

### Content and languages

All text lives in `src/data/*` as `{ he, en, ar, ru }` objects. Pages read the language from the `[lang]` route param on the server and pass only that language to client components.

Page metadata (title, description, canonical, hreflang) comes from `src/data/seo.ts`. When you edit a page's content, also update its date in `CONTENT_LAST_MODIFIED` (used in the sitemap).

### Images

Public pages fetch Cloudinary images on the server through `unstable_cache` (1 hour, tag `cloudinary-images`). Admin actions (upload, delete, tag) call `revalidateTag`, so the site updates right away without sending every visitor's request to the Cloudinary Admin API. `next/image` uses a Cloudinary loader (`src/lib/cloudinary/image-loader.ts`), so Cloudinary does the resizing.

### Ask AI

- **Instant results** (no AI, no key needed): `/api/search-index/[lang]` is generated at build time from `src/data`. The browser downloads it and MiniSearch only when the visitor focuses the box.
- **AI answer**: `POST /api/ask` retrieves the best-matching passages from the same corpus and streams a short answer from Claude (`AI_SEARCH_MODEL`, default `claude-haiku-5-5`). It has a same-origin check, a 300-character limit, 10 questions per IP per hour, and a global daily cap (`AI_SEARCH_DAILY_LIMIT`).
- Without `ANTHROPIC_API_KEY`, or when a limit is hit, the section still shows instant results plus a WhatsApp prompt.
- Logging: only the question text (phone numbers and emails scrubbed) and its language. No IPs or names.
- **Continue in chat**: under an AI answer, opens the chat assistant with that question and answer already in the conversation.

### Chat assistant

- **Widget** (`src/components/chat/`): a small "Ask us" button on every page (not admin). The panel's code is loaded only when the visitor first opens it. Desktop: ~380×600 panel; mobile: full-screen sheet that follows the on-screen keyboard. The conversation lives only in `sessionStorage` (survives page changes; "New conversation" clears it).
- **API** `POST /api/chat`: `{ messages, lang }`, last 12 messages, visitor messages ≤ 500 characters, roles must alternate. Same-origin check, 30 messages per IP per hour, daily cap `AI_CHAT_DAILY_LIMIT`, `max_tokens` 500, cached system prompt (`src/lib/search/chat-prompt.ts`). Each turn is grounded with passages retrieved from our content. Streams NDJSON (`src/lib/chat-protocol.ts`).
- **Quote requests**: the model can call `prepare_quote_request` only after the visitor asked for a quote and gave a name and phone. That only shows an editable confirmation card (including the visitor's chat messages that go with the request); nothing is sent until the visitor ticks consent and presses Send, which calls `POST /api/chat/lead` (CSRF + consent + validation, 3 per IP per hour) → Telegram via `src/lib/telegram.ts`.
- **Fallback**: without `ANTHROPIC_API_KEY`, when a limit is hit, or if the API fails, the chat shows 3 matching site pages plus WhatsApp and call buttons.
- **Privacy**: conversations aren't stored on the server. Logs contain only the event name, language and message count. Names, phones and the visitor's chat messages reach us only in a confirmed quote request; the messages are shown in the quote form and can be edited or deleted before sending.
- **Live check**: `node scripts/chat-smoke-test.mjs https://www.shwakiglassworks.com` sends a few test conversations (four languages, a price question, an off-topic request, a prompt-injection attempt, a quote request) and checks the replies. It never sends a lead. Needs `ANTHROPIC_API_KEY` on that deployment.

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**. Copy `.env.example` for local development.

| Variable | Required | Used for |
|---|---|---|
| `ADMIN_PASSWORD` | yes (admin) | Admin login password |
| `ADMIN_SESSION_SECRET` | yes (admin) | Signs the 24h admin session cookie. Random string, at least 32 characters |
| `CSRF_SECRET` | yes | Signs CSRF tokens for the contact form and chat quote requests. Random string, at least 32 characters. Both are disabled if missing |
| `TELEGRAM_BOT_TOKEN` | yes | Bot that receives contact-form leads and chat quote requests |
| `TELEGRAM_CHAT_ID` | yes | Chat or group the leads are sent to |
| `CLOUDINARY_CLOUD_NAME` | yes | Cloudinary account (server) |
| `CLOUDINARY_API_KEY` | yes | Cloudinary Admin/Search API (server only) |
| `CLOUDINARY_API_SECRET` | yes | Cloudinary Admin/Search API (server only) |
| `CLOUDINARY_BASE_FOLDER` | optional | Root folder, default `shwaki-glassworks`. Admin delete/tag only accept IDs inside it |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | yes | Image URLs in the browser |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | yes (admin) | Unsigned preset for the admin upload widget |
| `GOOGLE_PLACES_API_KEY` | recommended | Live Google rating in JSON-LD and the home description. Without it the rating is omitted |
| `GOOGLE_PLACE_ID` | recommended | The business's Google Place ID |
| `UPSTASH_REDIS_REST_URL` | recommended | Shared rate limiting (login, contact form, Ask AI, chat, chat leads). Without it limits are per serverless instance |
| `UPSTASH_REDIS_REST_TOKEN` | recommended | ″ |
| `ANTHROPIC_API_KEY` | optional | AI answers in the Ask AI section and the chat assistant. Without it, both show site results + WhatsApp instead |
| `AI_SEARCH_MODEL` | optional | Claude model for AI answers. Default `claude-haiku-5-5` |
| `AI_SEARCH_DAILY_LIMIT` | optional | Max AI answers per day, site-wide. Default `500` |
| `AI_CHAT_MODEL` | optional | Claude model for the chat assistant. Defaults to `AI_SEARCH_MODEL` (`claude-haiku-5-5`) |
| `AI_CHAT_DAILY_LIMIT` | optional | Max chat replies per day, site-wide. Default `1000` |

Generate secrets with:

```bash
openssl rand -hex 32
```

`ADMIN_TOKEN` is no longer used. Admin auth is now a signed cookie, so you can delete it.

## Security notes

- The contact form accepts only its own fields, validates them on the server, checks a honeypot and a 1-hour HMAC CSRF token, escapes HTML, and is rate-limited (5 per IP per 10 minutes). If Telegram rejects the HTML message, it retries as plain text so leads aren't lost.
- Admin: signed 24h session in an `httpOnly; Secure; SameSite=Strict` cookie. Nothing is stored in localStorage.
- The Cloudinary search endpoint whitelists categories, tags (`featured`, `hero-gallery`, `service-card`, `hero-1..7`, `service-card-<id>`) and cursors. Anything else returns 400.
- Security headers and CSP are in `vercel.json`.

## Deployment

Pushing to `main` deploys on Vercel. The build (`npm run build`) must pass type-checking. `npm ci` uses the committed `package-lock.json`.
