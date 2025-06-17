const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',
    pass: 'your-app-password'  // Use Gmail App Password
  }
});

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  transporter.sendMail({
    from: 'yourgmail@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  }, (err, info) => {
    if (err) return res.status(500).json({ success: false, message: 'Error sending email' });
    res.json({ success: true, message: 'OTP sent' });
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
