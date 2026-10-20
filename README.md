# Shwaki Brothers Glassworks

Website for **Shwaki Brothers Glassworks** (אחים שוואקי זכוכית), a glass installation business in Israel. Live at <https://www.shwakiglassworks.com>.

- **Next.js 16 (App Router)** + React 19 + TypeScript + Tailwind CSS
- **4 languages:** Hebrew (default, RTL), English, Arabic (RTL), Russian. Every page lives under `/[lang]/…`
- **Hosting:** Vercel
- **Images:** Cloudinary, fetched on the server and cached for 1 hour, with an admin panel at `/he/admin`
- **Leads:** contact form sends to Telegram
- **Ask AI:** home-page search with instant results from site content and answers from our own knowledge base
- **Chat assistant:** "Ask our AI" on every page — answers from our own knowledge base (free, no paid AI), a guided quote request sent to Telegram after the visitor confirms, WhatsApp and call

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

### Website assistant (free — no paid AI)

The home "Ask AI" box and the chat share one server pipeline (`src/lib/assistant.ts`). With no keys at all it works on layers 1 + 3, and no code path can create an AI bill.

1. **Our own answer engine** (`src/lib/answer-engine/`): no AI company, no API key, no external calls, a few milliseconds per answer.
   - Normalizes the text (niqqud, Arabic letter forms, "ё", Hebrew/Arabic prefixes), adds synonyms (`src/lib/search/synonyms.ts`) and tolerates typos.
   - Detects the language from the message itself and simple intents: greeting, thanks, complaint, out-of-scope, quote request, city, opening hours, contact, price.
   - Searches the knowledge base (`src/data/knowledge/`) with a 0–1 confidence: high → the answer with links and related questions; medium → "Did you mean…?"; low → layer 2 or 3. Thresholds: `src/lib/answer-engine/config.ts`.
   - Opening hours, contact details and "do you work in <city>?" are built from live data (`business-hours`, `CONTACT_INFO`, locations).
   - A short follow-up ("and for 10 mm?") is searched together with the previous question.
2. **Optional free-tier AI** (`src/lib/llm/`), only when layer 1 has no good answer and `AI_PROVIDER` is set.
   - It only rewrites the best knowledge base entries and page passages into a short answer. Phone numbers, e-mails and names given in common introductions ("my name is…", "קוראים לי…") are removed before sending (`src/lib/llm/privacy.ts`; other names can get through), and quote details are never sent.
   - Every answer is checked before it is shown: any number not in the provided content, the wrong language, a foreign link, off-topic or empty/too long → dropped, and layer 1/3 answers instead.
   - Caps: 20 AI answers per IP per hour, `AI_DAILY_LIMIT` per day (counted in Upstash), `max_tokens` 400, temperature 0.2, 8-second timeout. A hit cap or a failing provider silently falls back; visitors never see an error.
3. **Our team**: a guided quote request in the chat (product → city → size → timing → name → phone; everything but name and phone can be skipped), then the editable confirmation card with consent.
   - Nothing is sent until the visitor presses Send, which calls `POST /api/chat/lead` (CSRF + consent + validation, 3 per IP per hour) → Telegram (`src/lib/telegram.ts`).
   - When there's no answer, the visitor gets "I'm not sure about that one. Our team can answer quickly:" with free quote, WhatsApp (pre-filled with their question) and call.

**Knowledge base** (`src/data/knowledge/<topic>.ts`, one file per topic):
- Each entry has a question and 10+ customer-style paraphrases in he/en/ar/ru, a 40–120-word answer, 1–3 links, related ids, a `source` (where in `src/data` its facts come from), and a status.
- Only `approved` entries are used. The site's official FAQ pairs are included word for word (`faq-refs.ts`).
- `draft` entries need a fact from the owner; they are listed in `KNOWLEDGE_REVIEW.md` (`npm run knowledge:review`).

**Quality check**: `npm run test:answers` runs `tests/answer-engine/questions.json` (realistic customer questions with typos, slang, very short and out-of-scope ones) through layer 1 only.
- It prints accuracy per language, the "Did you mean" and "no answer" rates and every failure.
- It fails under 85% per language or on any direct answer to an out-of-scope question. It runs in CI (`.github/workflows/answers.yml`).

**Unanswered questions**: what layer 1 couldn't answer with a specific entry (no answer, out of scope, only "Did you mean" buttons or only the general price reply) is kept in Upstash (last 500, with phone numbers, e-mails and names given in common introductions removed) and shown in **Admin → Unanswered questions**, grouped by similarity, with a "Copy list" button (every wording included).
- A daily Telegram summary runs from Vercel Cron (`vercel.json`). It needs `CRON_SECRET` and Upstash; turn it off with `UNANSWERED_SUMMARY=off`. A failed read or send is included again the next day.

**Home "Ask AI" box**: instant results from the site while typing (`/api/search-index/[lang]`, built at build time). Enter asks `POST /api/ask`.
- "Popular questions" (six FAQ questions, `getPopularQuestions` in `src/data/faq.ts`) open the chat with the official answer instantly; FAQ entries among the instant results do the same.
- "Continue in chat" hands an answer over to the chat.

**Chat widget** (`src/components/chat/`):
- Always visible except on admin pages: a floating "Ask our AI" button on desktop (above the cookie banner while it is shown), "Ask AI" in the mobile bottom bar, the header and the mobile menu.
- A greeting bubble appears once per session. Other code opens the chat with `openChat()` from `chat-events.ts`.
- The panel's code loads on first open. The conversation lives only in `sessionStorage`.
- `POST /api/chat`: `{ messages, lang }` (last 12, visitor messages ≤ 500 characters, same-origin) or `{ entryId, lang }` for a suggestion button → `{ reply }` (`src/lib/chat-protocol.ts`).

**Privacy**: conversations aren't stored on the server, except the anonymized unanswered questions above. Logs contain only the event, language, layer and message count. Names, phones and the visitor's chat messages reach us only in a confirmed quote request.

**Live check**: `node scripts/chat-smoke-test.mjs https://<deployment>` asks a few questions in each language and prints which layer answered.

#### Optional: enable a free AI (layer 2)

> **Never add a credit card or enable billing on these accounts** — then they can never charge you. When a free quota runs out they just stop answering, and the site falls back to layer 1/3.

Set `AI_PROVIDER` to one provider, or a fallback chain such as `groq,cloudflare` (on a rate limit or failure the next one is tried). Keep `AI_DAILY_LIMIT` (default 300) below the providers' free daily quotas.

- **Groq** (`AI_PROVIDER=groq`):
  1. Sign up at [console.groq.com](https://console.groq.com) (free, no card).
  2. Open **API Keys → Create API Key** and copy it.
  3. In Vercel, set `GROQ_API_KEY` and `AI_PROVIDER=groq`, then redeploy. `GROQ_MODEL` defaults to `llama-3.3-70b-versatile`.
- **Cloudflare Workers AI** (`AI_PROVIDER=cloudflare`):
  1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com) and copy your **Account ID** (Workers AI page or the account overview).
  2. **My Profile → API Tokens → Create Token**, use the **Workers AI** template, and copy the token.
  3. In Vercel, set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` and `AI_PROVIDER=cloudflare`, then redeploy. The free plan has a daily allocation — don't upgrade to Workers Paid. `CLOUDFLARE_MODEL` defaults to `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- **Google AI Studio / Gemini** (`AI_PROVIDER=gemini`):
  1. Open [aistudio.google.com](https://aistudio.google.com) and choose **Get API key** in a project *without* billing.
  2. Copy the key.
  3. In Vercel, set `GEMINI_API_KEY` and `AI_PROVIDER=gemini`, then redeploy. `GEMINI_MODEL` defaults to `gemini-2.5-flash`.
  - **Free tier content may be used by Google to improve its products** — we send no personal data (contact details are removed, quote details are never sent).
- **Anthropic** (`AI_PROVIDER=anthropic`) is a **paid** adapter, kept only as an option. It is never used unless you set it explicitly.

### FAQ

`SHOW_FAQ_SECTIONS` in `src/data/site-features.ts` (now `false`) shows or hides the home FAQ section and the service pages' FAQ blocks, together with their FAQPage JSON-LD. Google requires the markup to match visible FAQ text.
- Service pages show an "Ask our AI" line in place of the block.
- The FAQ content stays in `src/data/faq.ts` and `src/data/service-seo-content.ts`, and is part of the assistant's knowledge base.

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
| `UPSTASH_REDIS_REST_URL` | recommended | Shared rate limiting (login, contact form, assistant, AI caps, chat leads) and the unanswered-questions list. Without it both are per serverless instance |
| `UPSTASH_REDIS_REST_TOKEN` | recommended | ″ |
| `AI_PROVIDER` | optional | Free-tier AI for questions our own engine can't answer: `none` (default — no AI at all), `groq`, `cloudflare`, `gemini`, or a chain like `groq,cloudflare`. See "Optional: enable a free AI" |
| `AI_DAILY_LIMIT` | optional | Max AI answers per day, site-wide (counted in Upstash). Default `300` — keep it below the free quotas. `0` turns the AI off |
| `GROQ_API_KEY` / `GROQ_MODEL` | optional | Groq free tier. Model default `llama-3.3-70b-versatile` |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_MODEL` | optional | Cloudflare Workers AI free allocation. Model default `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | optional | Google AI Studio free tier (content may be used by Google — we send no personal data). Model default `gemini-2.5-flash` |
| `ANTHROPIC_API_KEY` / `AI_CHAT_MODEL` | optional, **paid** | Only used with `AI_PROVIDER=anthropic`. Model default `claude-haiku-5-5` |
| `CRON_SECRET` | optional | Enables the daily Telegram summary of unanswered questions (Vercel Cron sends it) |
| `UNANSWERED_SUMMARY` | optional | `off` turns that summary off |

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
