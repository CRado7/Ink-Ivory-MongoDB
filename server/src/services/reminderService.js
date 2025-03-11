import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import { sendEmail } from '../utils/Mailer.js';

const scheduleReminders = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔔 Checking for upcoming appointments...');

    const now = new Date();
    const reminderTime = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now

    const upcomingAppointments = await Appointment.find({
      date: {
        $gte: reminderTime.toISOString().split('T')[0], // Match the date
      },
      startTime: {
        $gte: reminderTime.toTimeString().split(' ')[0], // Match the time
      },
    }).populate('artist');

    for (const appointment of upcomingAppointments) {
      const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const start = new Date(`${appointment.date}T${appointment.startTime}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const emailSubject = 'Appointment Reminder - Ink & Ivory';
      const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fafafa;">
          <h2 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px; text-align: center;">
            Appointment Reminder
          </h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
            Hi <strong>${appointment.name}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
            This is a friendly reminder about your upcoming appointment with <strong>${appointment.artist.name}</strong>.
          </p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px;">
              <strong>Date:</strong> ${formattedDate}<br>
              <strong>Time:</strong> ${start}
            </p>
          </div>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
            We look forward to seeing you soon!
          </p>
          <footer style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
            © 2025 Ink & Ivory. All rights reserved.
          </footer>
        </div>
      `;

      try {
        await sendEmail(appointment.email, emailSubject, '', emailBody);
        console.log(`✅ Reminder email sent to ${appointment.email}`);
      } catch (error) {
        console.error(`❌ Failed to send reminder email to ${appointment.email}:`, error);
      }
    }
  });
};

export default scheduleReminders;
