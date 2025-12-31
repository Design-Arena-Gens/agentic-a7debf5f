# Telegram Bot on Next.js

This project delivers a production-ready Telegram bot webhook implemented with the Next.js App Router and designed for painless deployment on Vercel.

## Features

- Secure webhook endpoint with `X-Telegram-Bot-Api-Secret-Token` validation
- Opinionated default replies for `/start`, `/help`, and `/echo` commands
- Simple landing page with guidance for configuring the bot and project secrets
- TypeScript-first project configuration, linting, and strict compile-time safety

## Quickstart

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file (ignored by git) and provide the secrets issued by `@BotFather`:

```
TELEGRAM_BOT_TOKEN=123456789:ABCDEF...
TELEGRAM_SECRET_TOKEN=your-shared-secret
```

### 3. Run locally

```bash
npm run dev
```

Expose the local server (e.g. with [`ngrok`](https://ngrok.com/)) and register the webhook so Telegram can reach your machine:

```bash
curl -X POST \
  https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<your-tunnel>.ngrok.io/api/telegram",
    "secret_token": "'${TELEGRAM_SECRET_TOKEN}'"
  }'
```

Messages sent to your bot will now be routed to `app/api/telegram/route.ts`.

## Deploy to Vercel

1. Push this repository to your Git provider and import it into Vercel.
2. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_SECRET_TOKEN` as **Encrypted** environment variables.
3. Deploy the project—Vercel will serve the webhook at `https://<deployment>/api/telegram`.
4. Call `setWebhook` again pointing to the new production URL and using the same secret token.

## Extend the bot

- Update `buildReply` inside `app/api/telegram/route.ts` to implement richer behaviour.
- Enrich `lib/telegram.ts` with more Bot API helpers for keyboards, inline queries, etc.
- Add additional API routes for administrative tools or dashboards as needed.

## Scripts

- `npm run dev` – start the Next.js dev server
- `npm run build` – create the production bundle
- `npm start` – run the production server locally
- `npm run lint` – execute ESLint checks
- `npm run typecheck` – run strict TypeScript diagnostics

## Folder layout

```
app/                   Next.js App Router pages and API routes
lib/                   Reusable utilities
app/api/telegram/      Telegram webhook implementation
```

You now have a fully operational Telegram bot surface ready to deploy. Iterate on the webhook logic to shape the conversational experience you need.
