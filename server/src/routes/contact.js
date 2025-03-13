import express from 'express';
import { sendEmail } from '../utils/Mailer.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const emailSubject = `New Contact Form Submission from ${name}`;
    const emailBody = `
      <div>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;

    await sendEmail(process.env.EMAIL_USER, emailSubject, '', emailBody);

    console.log(`✅ Email sent from ${email}`);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('🔥 Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

export default router;
