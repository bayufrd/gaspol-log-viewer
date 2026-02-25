module.exports = {
  apps: [
    {
      name: 'gaspol-log-viewer',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      restart_delay: 5000,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3030
      },
      error_file: './logs/pm2/error.log',
      out_file: './logs/pm2/out.log',
      merge_logs: true,
      watch: false
    }
  ]
}
