/* pm2 process definitions, one per environment. Both run as the vertis
   user on internal ports that nginx proxies to. scripts/server-deploy.sh
   reloads the matching one after every build with
   `pm2 startOrReload ecosystem.config.cjs --only <name>`. */
const site = (name, dir, port) => ({
  name,
  cwd: `/var/www/vertisglobal.com/${dir}/app`,
  script: "node_modules/next/dist/bin/next",
  args: `start -p ${port} -H 127.0.0.1`,
  env: { NODE_ENV: "production", PORT: String(port) },
  instances: 1,
  autorestart: true,
  max_memory_restart: "600M",
  out_file: `/home/vertis/.pm2/logs/${name}-out.log`,
  error_file: `/home/vertis/.pm2/logs/${name}-error.log`,
  time: true,
});

module.exports = {
  apps: [
    site("vertis-staging", "staging", 3010),     // staging.vertisglobal.com
    site("vertis-production", "production", 3011), // vertisglobal.com
  ],
};
