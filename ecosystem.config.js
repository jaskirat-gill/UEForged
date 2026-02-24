/**
 * PM2 ecosystem file. Run from this directory: pm2 start ecosystem.config.js
 * Single app: Next.js (frontend + Payload admin at /admin, API at /api) on port 3000.
 */
module.exports = {
  apps: [
    {
      name: 'ue-forged',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start',
      interpreter: 'node',
      env: { NODE_ENV: 'production' },
      instances: 1,
      exec_mode: 'fork',
    },
  ],
}
