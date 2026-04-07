import nodemailer from 'nodemailer';
export const sendReminderEmail = async ({ to, productName, expiryDate, daysLeft }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const t = nodemailer.createTransport({ host:process.env.EMAIL_HOST, port:+process.env.EMAIL_PORT||587, secure:false, auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS} });
  const label = daysLeft===0?'expires today':`expires in ${daysLeft} day${daysLeft>1?'s':''}`;
  await t.sendMail({ from:process.env.EMAIL_FROM, to, subject:`ExpiryAlert: ${productName} ${label}`,
    html:`<p><strong>${productName}</strong> ${label}.<br>Expiry: ${new Date(expiryDate).toDateString()}</p>` });
};
