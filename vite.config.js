import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleApiChat, handleApiAnalyze } from './src/server/apiHandler.js';

function apiServerPlugin(apiKey) {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const activeKey = (apiKey || process.env.GEMINI_API_KEY || '').trim();
        const hasKey = Boolean(activeKey && activeKey.length > 10);

        if (req.url === '/api/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            aiConfigured: hasKey,
            provider: hasKey ? 'gemini' : 'local',
            model: hasKey ? 'gemini-flash-lite-latest' : 'conversational-engine-v2'
          }));
          return;
        }

        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = await handleApiChat(parsed, activeKey);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = await handleApiAnalyze(parsed, activeKey);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  process.env.GEMINI_API_KEY = apiKey;

  return {
    plugins: [react(), tailwindcss(), apiServerPlugin(apiKey)]
  };
});
