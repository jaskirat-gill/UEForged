# UEForged — Operator Guide

Luxury forged-wheel portfolio site. **Payload CMS 3 + Next.js 15** (one app: frontend, admin at `/admin`, REST API at `/api`), MongoDB, Tailwind v4.

## Production

- **Server**: DigitalOcean droplet (Ubuntu 24.04, 1GB + 2GB swap, SFO3), in the "UEForged" DO team
- **Address**: reserved IP `129.212.166.116` (use this for SSH and DNS — it survives droplet rebuilds)
- **App**: `/var/www/ueforged`, runs under PM2 as `ue-forged`, Nginx proxies 80 → 3000
- **Database**: MongoDB on the droplet, `mongodb://127.0.0.1:27017/ue-forged` (localhost only)
- **Media**: stored on disk in `/var/www/ueforged/media` — NOT in git. Back it up together with `mongodump`; one without the other is an incomplete backup.
- **Env**: `/var/www/ueforged/.env` (`DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `RESEND_API_KEY`)

## Updating content programmatically (REST API)

Use this for bulk imports (e.g. a spreadsheet of wheels/builds). Auth is a Payload API key:

1. In `/admin`, open your user → check **Enable API Key** → copy the key.
2. Send it on every request: `Authorization: users API-Key <key>`

Typical import flow — upload the image first, then reference its id:

```bash
# 1. Upload an image (multipart; other fields go in _payload as JSON)
curl -s -X POST "$SITE/api/media" \
  -H "Authorization: users API-Key $KEY" \
  -F file=@wheel.jpg \
  -F '_payload={"alt":"UEF wheel three-quarter view"}'
# → response contains doc.id

# 2. Create the document referencing the media id
curl -s -X POST "$SITE/api/wheels" \
  -H "Authorization: users API-Key $KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"VFS-3","slug":"vfs-3","series":"<series-id>","description":"...",
       "startingPricePerWheel":1400,"images":[{"image":"<media-id>"}],"featured":false}'
```

Key collections (all under `/api/<slug>`; GET is public, writes need auth):

- **wheels**: `name`*, `slug`* (unique), `series` (relation id — `GET /api/series` to look up), `description`, `startingPricePerWheel`, `images: [{image: <media-id>}]`, `featured`, `tags: [{tag}]`, optional `pricingOverrides`
- **builds**: `title`*, `slug`*, `carMake`*, `carModel`*, `year`* (number), `wheelUsed` (wheel relation id), `finish` (text), `photographerCredit`, `images: [{image}]`, `featured`
- **media**: multipart upload, `alt` required
- **globals**: `GET/POST /api/globals/site-settings` (hero/backgrounds/contactEmail), `/api/globals/wheel-pricing`

Everyday one-off edits are easier in the admin panel — the API is for bulk/scripted work.

## Deploying code changes

```bash
ssh root@129.212.166.116 'bash /var/www/ueforged/deploy.sh'
```

`deploy.sh` does: `git pull` → `pnpm install` → `pnpm build` → `pm2 restart ue-forged`.

**The 1GB droplet builds slowly** (leans on swap, ~10 min). For faster deploys, build locally and ship the artifact:

```bash
pnpm build && rsync -az --delete .next/ root@129.212.166.116:/var/www/ueforged/.next/
ssh root@129.212.166.116 'cd /var/www/ueforged && git pull && pnpm install && pm2 restart ue-forged'
```

Content changes (admin panel or API) need **no deploy** — they're live immediately.

## Local dev

`pnpm install`, copy `.env.example` → `.env` (local Mongo), `pnpm dev`. Seed empty DB with `pnpm run seed`. Regenerate types after schema changes: `pnpm run generate:types`.

## Cautions

- Never delete `/var/www/ueforged/media` or reclone over it — uploaded photos live only there and in backups.
- `.env` on the server holds real secrets; never commit it.
- Nginx config: `/etc/nginx/sites-available/ueforged` (keep `client_max_body_size 25M` — admin uploads break without it).
- Weekly DO droplet backups are on; media+DB also deserve an off-droplet copy before risky changes.
