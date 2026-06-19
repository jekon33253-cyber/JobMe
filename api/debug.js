export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  return res.status(200).json({
    node: process.version,
    tokenSet: !!token,
    tokenPreview: token ? token.slice(0, 12) + '...' : null,
    chatIdSet: !!chatId,
    chatIdPreview: chatId || null,
  });
}
