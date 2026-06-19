export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body (Vercel auto-parses JSON, but fallback for safety)
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { target, name, phone, city, email, messenger } = body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('Missing Telegram env vars. TOKEN:', token ? 'set' : 'MISSING', 'CHAT_ID:', chatId ? 'set' : 'MISSING');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const typeLabel = target === 'pracodawca' ? 'Pracodawca' : 'Kandydat';

    let messageText = `🔥 Nowy lead z JobMe!\n\n`;
    messageText += `• Typ: ${typeLabel}\n`;
    messageText += `• Imię: ${name || 'Brak'}\n`;
    messageText += `• Telefon: ${phone || 'Brak'}\n`;
    messageText += `• Miasto: ${city || 'Brak'}\n`;

    if (target === 'pracodawca' && email) {
      messageText += `• E-mail: ${email}\n`;
    }

    if (messenger) {
      messageText += `• Komunikator: ${messenger}\n`;
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram API Error:', JSON.stringify(result));
      return res.status(500).json({ error: 'Failed to send message to Telegram', detail: result.description || 'unknown' });
    }

    console.log('Lead sent to Telegram:', name, phone);
    return res.status(200).json({ success: true, message: 'Wiadomość wysłana' });

  } catch (error) {
    console.error('Contact API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
