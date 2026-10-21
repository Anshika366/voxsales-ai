export default function handler(req, res) {
  const activeKey = (process.env.GEMINI_API_KEY || '').trim();
  const hasKey = Boolean(activeKey && activeKey.length > 10);
  return res.status(200).json({
    aiConfigured: hasKey,
    provider: hasKey ? 'gemini' : 'local',
    model: hasKey ? 'gemini-flash-lite-latest' : 'conversational-engine-v2'
  });
}
