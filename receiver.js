import express from 'express';
import bodyParser from 'body-parser';
import { verifySignature } from './verifySign.js';
const app = express();
const PORT = 3000;

// To parse JSON body as a raw buffer for signature verification
app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/webhook', verifySignature, (req, res) => {
    const payload = JSON.parse(req.body);

    console.log('🎯 Webhook Received:', payload);

    // Simulate async event handling (e.g., DB write, job queue)
    console.log('✅ Event Processed:', payload.status);

    res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}/webhook`);
});
