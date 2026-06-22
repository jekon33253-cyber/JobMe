export default async function handler(req, res) {
  // CORS Headers
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

    const { to, subject, html, text } = body || {};

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html/text' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    // 1. If Resend API Key is set, send via Resend
    if (resendApiKey) {
      console.log(`Sending email to ${to} via Resend...`);
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'JobMe Portal <noreply@jobme.pl>',
          to,
          subject,
          html: html || `<p>${text}</p>`,
        })
      });

      const resendResult = await resendRes.json();
      if (!resendRes.ok) {
        console.error('Resend API Error:', resendResult);
        return res.status(500).json({ error: 'Resend API failed', details: resendResult });
      }

      console.log(`Email successfully sent to ${to} via Resend.`);
      return res.status(200).json({ success: true, message: 'Email sent successfully via Resend', id: resendResult.id });
    }

    // 2. Fallback to Telegram notification if Telegram is configured
    if (tgToken && tgChatId) {
      console.log('Resend key not set. Falling back to Telegram for notification...');
      const messageText = `📧 *JobMe Notification Fallback*\n\n*To:* ${to}\n*Subject:* ${subject}\n*Body:* ${text || html?.replace(/<[^>]*>/g, '')}`;
      
      const telegramUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
      const telegramRes = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: messageText,
          parse_mode: 'Markdown',
        }),
      });

      const tgResult = await telegramRes.json();
      if (!telegramRes.ok) {
        console.error('Telegram notification fallback failed:', tgResult);
        return res.status(500).json({ error: 'Failed to send notification via Telegram', details: tgResult });
      }

      console.log('Notification sent via Telegram fallback.');
      return res.status(200).json({ success: true, message: 'Notification sent via Telegram fallback' });
    }

    // 3. Neither configured
    console.warn('Neither Resend API Key nor Telegram Bot is configured for notifications.');
    console.log(`MOCK EMAIL NOTIFICATION:\nTo: ${to}\nSubject: ${subject}\nBody: ${text || html}`);
    return res.status(200).json({
      success: true,
      message: 'Mock notification logged (no email or telegram credentials configured)'
    });

  } catch (error) {
    console.error('Notification API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
