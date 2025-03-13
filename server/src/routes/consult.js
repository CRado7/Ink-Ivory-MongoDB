import express from 'express';
import { sendEmail } from '../utils/Mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, preferredDate, preferredTime, artistName } = req.body;

  if (!name || !email || !preferredDate || !preferredTime || !artistName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedPreferredTime = new Date(`${preferredDate}T${preferredTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });


  try {
    const subject = `New Consult Request with ${artistName}`;
    const html = `
      <div>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Preferred Date:</strong> ${formattedDate}</p>
        <p><strong>Preferred Time:</strong> ${formattedPreferredTime}</p>
        <p><strong>Artist:</strong> ${artistName}</p>
      </div>
    `;

    // ✅ Send email using existing mailer
    await sendEmail(process.env.EMAIL_USER, subject, '', html);

    console.log(`✅ Consult request email sent for ${name}`);
    res.status(200).json({ message: 'Consult request sent successfully!' });
  } catch (error) {
    console.error('🔥 Error sending consult request email:', error);
    res.status(500).json({ message: 'Failed to send consult request email', error });
  }
});

export default router;
