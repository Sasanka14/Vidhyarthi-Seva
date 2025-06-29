const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../utils/emailService');

router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;
  console.log('Received contact form submission:', req.body);
  if (!firstName || !lastName || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const sent = await sendContactMessage({ firstName, lastName, email, phone, subject, message });
    if (sent) {
      return res.status(200).json({ message: 'Message sent successfully!' });
    } else {
      return res.status(500).json({ message: 'Failed to send message.' });
    }
  } catch (error) {
    console.error('Contact form route error:', error);
    return res.status(500).json({ message: 'Server error.', error });
  }
});

module.exports = router; 