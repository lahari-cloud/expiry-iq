import nodemailer from 'nodemailer';

export const sendReminderEmail = async ({ to, productName, expiryDate, daysLeft }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const label = daysLeft === 0 ? 'expires today' : `expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Expiry Alert',
    text: `Your product "${productName}" ${label}. Expiry date: ${new Date(expiryDate).toDateString()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#0f172a;margin-bottom:8px">⏰ Expiry Alert</h2>
        <p style="font-size:16px;color:#374151">Your product <strong>${productName}</strong> ${label}.</p>
        <p style="font-size:14px;color:#6b7280">Expiry date: <strong>${new Date(expiryDate).toDateString()}</strong></p>
        <p style="font-size:13px;color:#9ca3af;margin-top:24px">Sent by ExpiryAlert</p>
      </div>
    `,
  });
};