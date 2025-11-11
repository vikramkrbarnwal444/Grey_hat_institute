// server.js
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: ['https://greyhatinstitute.in'], // 🔒 change to your live domain
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 🧾 Create order
app.post('/create-order', async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Missing user info' });
    }

    const options = {
      amount: (amount || 299) * 100,
      currency: "INR",
      receipt: `rec_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    console.log(`🧾 Order created: ${order.id} for ${name}`);

    res.json({ 
      success: true, 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Could not create order' });
  }
});

// ✅ Verify payment
app.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, email, phone } = req.body;

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log(`✅ Payment verified: ${razorpay_payment_id} (${name}, ${email})`);
      const whatsappInviteLink = "https://chat.whatsapp.com/KYV3avhrc3VC48y96C69vf";
      res.json({ success: true, message: 'Payment verified', invite: whatsappInviteLink });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Verification error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




