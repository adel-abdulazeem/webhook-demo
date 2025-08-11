import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const RECEIVER_URL = process.env.RECEIVER_URL;

function sendWebhook(payload) {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(8).toString('hex');

    const rawBody = JSON.stringify(payload);
    const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(`${timestamp}.${nonce}.${rawBody}`)
        .digest('hex');

    console.log('🔐 Signature:', signature);
    console.log('⏰ Timestamp:', timestamp);
    console.log('🔑 Nonce:', nonce);
    console.log('Raw Body:', rawBody);
    return axios.post(RECEIVER_URL, rawBody, {
        headers: {
            'Content-Type': 'application/json',
            'x-signature': signature,
            'x-timestamp': timestamp,
            'x-nonce': nonce
        }
    });
}

// Example dynamic payload
sendWebhook({ orderId: 123, status: 'shipped' })
    .then(res => console.log(res.data))
    .catch(err => console.error(err.response?.data || err.message));
