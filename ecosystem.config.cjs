/* pm2 process definition for staging.vertisglobal.com.
   Runs as the vertis user on an internal port; nginx proxies to it.
   The deploy script reloads it after every build. */
module.exports = {
  apps: [
    {
      name: "vertis-staging",
      cwd: "/var/www/vertisglobal.com/staging/app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3010 -H 127.0.0.1",
      env: { NODE_ENV: "production", PORT: "3010" },
      instances: 1,
      autorestart: true,
      max_memory_restart: "600M",
      out_file: "/home/vertis/.pm2/logs/vertis-staging-out.log",
      error_file: "/home/vertis/.pm2/logs/vertis-staging-error.log",
      time: true,
    },
  ],
};
