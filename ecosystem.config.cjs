module.exports = {
  apps: [
    {
      name: 'ue-forged',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/ueforged',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}