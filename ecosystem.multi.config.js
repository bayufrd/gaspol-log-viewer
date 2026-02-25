/**
 * PM2 ecosystem template to run multiple apps.
 *
 * IMPORTANT:
 * - This is a template based on the PM2 names seen on your server (gaspol-api, gaspol-cms, gaspol-log,
 *   jempolan-be, jempolan-fe). Adjust `cwd`, `env.PORT`, and `script/args` to match each app's real start command.
 * - If an app is started by `npm start` in a subfolder, keep `script: 'npm'` and `args: 'start'` and set cwd to that folder.
 * - If an app is started by a JS file (e.g. server.js), set `script: 'node'` and `args: 'server.js'`.
 */

const path = require('path');

// ROOT resolves to the directory where this ecosystem file lives (place it in repo root)
const ROOT = path.resolve(__dirname);

module.exports = {
    apps: [
        {
            name: 'gaspol-api',
            script: 'npm',
            args: 'start',
            // repo layout on the server: absolute path under /root
            cwd: '/root/gaspol-repo/gaspol-api',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            env: { NODE_ENV: 'production', PORT: 5000 },
            merge_logs: true
        },

        {
            name: 'gaspol-cms',
            script: 'npm',
            args: 'start',
            // inferred location: absolute path under /root
            cwd: '/root/gaspol-repo/gaspol-cms',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            env: { NODE_ENV: 'production', PORT: 8080 },
            merge_logs: true
        },

        {
            name: 'gaspol-log',
            script: 'npm',
            args: 'start',
            // this repository is the gaspol-log viewer (next app) — absolute repo root
            cwd: '/root/gaspol-log-viewer',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            env: { NODE_ENV: 'production', PORT: 3030 },
            merge_logs: true
        },

        {
            name: 'jempolan-be',
            // backend is started with node backend/server.js (see package.json scripts)
            script: 'node',
            args: 'backend/server.js',
            // run from jempolan-lp repo root
            cwd: '/root/jempolan-lp',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            env: { NODE_ENV: 'production', PORT: 3000 },
            merge_logs: true
        },

        {
            name: 'jempolan-fe',
            script: 'npm',
            args: 'start',
            // inferred location: absolute path under /root
            cwd: '/root/jempolan-lp/jempolan-fe',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            env: { NODE_ENV: 'production', PORT: 1234 },
            merge_logs: true
        }
    ]
}
