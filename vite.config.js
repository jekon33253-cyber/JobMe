import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// ── Load .env for API handlers ─────────────────────────────────
function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}
loadEnvFile();

// ── Simple API middleware for local dev ─────────────────────────
// Matches Vercel-style serverless functions in /api/**/*.js
function apiPlugin() {
  return {
    name: 'vite-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        // Match /api/contact → api/contact.js
        const apiPath = req.url?.split('?')[0] || '';
        const handlerFile = resolve(process.cwd(), 'api', `${apiPath.replace('/api/', '')}.js`);

        if (!existsSync(handlerFile)) {
          return next();
        }

        try {
          // Read body
          let body = '';
          if (req.method === 'POST') {
            body = await new Promise((resolve) => {
              let data = '';
              req.on('data', chunk => data += chunk);
              req.on('end', () => resolve(data));
            });
          }

          // Rebuild as Vercel-compatible request object
          const vercelReq = {
            method: req.method,
            headers: req.headers,
            body: body ? JSON.parse(body) : {},
            query: Object.fromEntries(new URL(req.url, 'http://localhost').searchParams),
          };

          const vercelRes = {
            status(code) {
              res.statusCode = code;
              return this;
            },
            json(data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            send(data) {
              res.end(data);
            },
          };

          // Dynamic import to avoid caching issues in dev
          const mod = await import(`${handlerFile}?t=${Date.now()}`);
          await mod.default(vercelReq, vercelRes);
        } catch (err) {
          console.error('API Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
})
