export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { target, name, phone, city, email, messenger } = req.body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('Missing Telegram credentials in env');
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Telegram API Error:', errorData);
      return res.status(500).json({ error: 'Failed to send message to Telegram' });
    }

    return res.status(200).json({ success: true, message: 'Wiadomość wysłana' });

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
