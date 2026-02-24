# Deploy to DigitalOcean Ubuntu Droplet

Step-by-step guide to run this app (Next.js + Payload CMS) on an Ubuntu droplet with Nginx, PM2, and optional SSL.

## Prerequisites

- A DigitalOcean droplet running Ubuntu 22.04 LTS
- SSH access and a non-root user with sudo
- A domain pointing to the droplet’s IP (for SSL)

## 1. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

## 2. Install pnpm

```bash
sudo npm install -g pnpm
```

## 3. Install MongoDB

**Option A – Local MongoDB on the droplet**

```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

Use `DATABASE_URL=mongodb://127.0.0.1:27017/ue-forged` in `.env`.

**Option B – Keep MongoDB Atlas**

Use your existing Atlas connection string in `DATABASE_URL` (ensure the droplet IP is allowed in Atlas Network Access).

## 4. Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

## 5. Install PM2

```bash
sudo npm install -g pm2
```

## 6. Clone the repo and install dependencies

```bash
cd /var/www
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
git clone <your-repo-url> ueforged
cd ueforged/ue-forged
pnpm install
```

## 7. Environment variables

```bash
cp .env.example .env
nano .env
```

Set at least:

- `DATABASE_URL` – MongoDB URI (local or Atlas)
- `PAYLOAD_SECRET` – long random string (e.g. `openssl rand -base64 32`)
- `PAYLOAD_PUBLIC_SERVER_URL` – public URL (e.g. `https://yourdomain.com`)
- `RESEND_API_KEY` – if using contact/inquiry email

## 8. Build and run with PM2

```bash
pnpm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

The app runs on port 3000 (frontend and Payload admin at `/admin`, API at `/api`).

## 9. Nginx reverse proxy

Create a server block:

```bash
sudo nano /etc/nginx/sites-available/ueforged
```

Contents (replace `yourdomain.com` and ensure upstream port matches your app):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/ueforged /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 10. SSL with Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts. Certbot will adjust Nginx for HTTPS. Renewal is automatic.

## 11. Media uploads

Media is stored on disk in the app’s `media/` directory (relative to the app’s working directory). Ensure the process has write access to that directory and that backups include it if needed.

## Summary

- **App**: One Next.js app (Payload included) on port 3000.
- **PM2**: `ecosystem.config.js` runs that app; use `pm2 logs` and `pm2 restart all` as needed.
- **Nginx**: Proxies port 80/443 to 3000.
- **MongoDB**: Local (`mongod`) or Atlas; set `DATABASE_URL` in `.env`.
- **SSL**: Certbot configures Nginx for HTTPS.
