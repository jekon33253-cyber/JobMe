export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ Test z JobMe API — jeżeli to widzisz, integracja działa!',
      }),
    });

    const result = await response.json();
    return res.status(200).json({
      ok: response.ok,
      status: response.status,
      telegramResponse: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
