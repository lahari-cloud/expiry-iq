import cron from 'node-cron';
import Product from '../models/Product.js';
import { sendReminderEmail } from '../services/emailService.js';

const dayDiff = (target) => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(target); end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

const runCheck = async () => {
  const products = await Product.find({}).populate('user', 'email name notifyEmail');

  for (const product of products) {
    const diff = dayDiff(product.expiryDate);
    let field = null;
    if (diff === 7) field = 'sevenDaySent';
    else if (diff === 3) field = 'threeDaySent';
    else if (diff === 0) field = 'sameDaySent';
    if (!field || product.reminderHistory[field]) continue;

    const user = product.user;
    if (user?.notifyEmail !== false) {
      await sendReminderEmail({
        to: user.email,
        productName: product.name,
        expiryDate: product.expiryDate,
        daysLeft: diff,
      });
      console.log(`Email sent to ${user.email} for "${product.name}" (${diff}d)`);
    }

    product.reminderHistory[field] = true;
    await product.save();
  }
};

export const startReminderJob = () => {
  // Runs every day at 09:00 AM server time
  cron.schedule('0 9 * * *', () => runCheck().catch(console.error));
  console.log('Reminder cron scheduled: 09:00 daily');
};