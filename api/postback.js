const axios = require('axios');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'GET') {
            return res.status(405).send('Method Not Allowed');
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;
        const SECRET_KEY = process.env.SECRET_KEY;

        if (!TELEGRAM_BOT_TOKEN || !CHAT_ID || !SECRET_KEY) {
            return res.status(500).send('Missing environment variables');
        }

        if (req.query.key !== SECRET_KEY) {
            return res.status(403).send('Forbidden');
        }

        // Get parameters from the query
        const clickId = req.query.click_id;
        const device = req.query.Device;
        const mac = req.query.mac;
        const payout = req.query.payout;

        if (!clickId || !device || !mac || !payout) {
            return res.status(400).send('Missing parameters');
        }

        // Customize your message here
        const message = `✅ *New Conversion!*\n\n🆔 *Click ID:* \`${clickId}\`\n📱 *Device:* \`${device}\`\n🔗 *MAC Address:* \`${mac}\`\n💰 *Payout:* \`${payout}\`\n🕒 *Time:* ${new Date().toLocaleString()}`;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown"
        });

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};