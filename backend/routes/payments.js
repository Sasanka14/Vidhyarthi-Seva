const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for course purchase
router.post('/create-order', async (req, res) => {
  const { amount, courseId, userId } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_course_${courseId}_${Date.now()}`,
      notes: { courseId, userId },
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Razorpay order creation failed', error: err.message });
  }
});

// Verify payment and save to DB
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId, amount } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      // Save payment to DB
      const payment = await Payment.create({
        user: userId,
        course: courseId,
        amount,
        currency: 'INR',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
      });
      res.json({ success: true, message: 'Payment verified', payment });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Payment saved but DB error', error: err.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

// Get all payments (admin only)
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments', error: err.message });
  }
});

module.exports = router; 