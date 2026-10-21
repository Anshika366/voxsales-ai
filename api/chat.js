import { handleApiChat } from '../src/server/apiHandler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const body = req.body || {};
  const parsed = typeof body === 'string' ? JSON.parse(body || '{}') : body;

  try {
    const result = await handleApiChat(parsed, apiKey);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
