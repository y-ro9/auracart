import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderData } = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Check karo env variables load hue ya nahi
  if (!token || !chatId) {
    console.error("❌ Missing Env Vars: TOKEN:", token, "CHAT_ID:", chatId);
    return res.status(500).json({ error: 'Telegram credentials missing in .env.local' });
  }

  const message = `
🛍️ *NEW ORDER: ${orderData.orderNumber}*
👤 *Name:* ${orderData.customerName}
📞 *Phone:* ${orderData.phone}
📍 *Address:* ${orderData.address}, ${orderData.city} - ${orderData.pincode}

📦 *Items:*
${orderData.items.map((i: any) => `- ${i.name} (${i.size}) x${i.quantity}`).join('\n')}

💰 *Total:* ₹${orderData.total} (COD)
📅 *Delivery By:* ${orderData.deliveryDate}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("❌ Telegram API Error:", data);
      return res.status(500).json({ error: data.description || 'Telegram rejected message' });
    }

    console.log("✅ Telegram message sent successfully!");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return res.status(500).json({ error: 'Failed to connect to Telegram' });
  }
}