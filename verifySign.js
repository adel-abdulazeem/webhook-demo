import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const seenNonces = new Set();

const verifySignature = (req, res, next) => {
    const signature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];
    const nonce = req.headers['x-nonce'];

    if (!signature || !timestamp || !nonce) {
        return res.status(401).send('Missing signature, timestamp, or nonce');
    }

    // Expiration check
    const now = Date.now();
    if (Math.abs(now - Number(timestamp)) > 5 * 60 * 1000) {
        return res.status(408).send('Request expired');
    }

    // Replay check
    if (seenNonces.has(nonce)) {
        return res.status(409).send('Nonce already used');
    }
    seenNonces.add(nonce);

    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(`${timestamp}.${nonce}.${req.body}`)
        .digest('hex');
    console.log('🔐 Expected Signature:', expectedSignature);
    console.log('⏰ Timestamp:', timestamp);
    console.log('🔑 Nonce:', nonce);
    console.log('Raw Body:', req.body);

    if (signature !== expectedSignature) {
        return res.status(403).send('Invalid signature');
    }

    next();
};

export { verifySignature };