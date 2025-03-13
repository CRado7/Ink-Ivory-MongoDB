import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Ink & Ivory" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  // console.log(`📧 Sending email to ${to}...`);
  // console.log("Email User:", process.env.EMAIL_USER);
  // console.log("Email Pass:", process.env.EMAIL_PASS);

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("🔥 Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
