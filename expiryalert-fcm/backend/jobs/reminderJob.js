import cron from 'node-cron';
import Product from '../models/Product.js';
import { sendReminderEmail } from '../services/emailService.js';
import { sendPushNotification } from '../utils/firebase.js';

const dayDiff = (d) => { const s=new Date();s.setHours(0,0,0,0); const e=new Date(d);e.setHours(0,0,0,0); return Math.round((e-s)/86400000); };

const run = async () => {
  const products = await Product.find({}).populate('user','name email fcmTokens notifyEmail notifyPush');
  for (const p of products) {
    const diff = dayDiff(p.expiryDate);
    let field = null;
    if (diff===7) field='sevenDaySent';
    else if (diff===3) field='threeDaySent';
    else if (diff===0) field='sameDaySent';
    if (!field || p.reminderHistory[field]) continue;

    const user = p.user;
    const label = diff===0 ? 'expires today!' : `expires in ${diff} day${diff>1?'s':''}!`;
    const title = 'Expiry Alert 🔔';
    const body  = `Your product "${p.name}" ${label}`;

    if (user.notifyPush && user.fcmTokens?.length) {
      for (const token of user.fcmTokens) {
        await sendPushNotification({ token, title, body, data:{ productId: p._id.toString(), daysLeft: String(diff) } });
      }
    }
    if (user.notifyEmail) {
      await sendReminderEmail({ to:user.email, productName:p.name, expiryDate:p.expiryDate, daysLeft:diff });
    }

    p.reminderHistory[field] = true;
    await p.save();
    console.log(`Reminder sent: ${p.name} (${diff} days)`);
  }
};

export const startReminderJob = () => {
  cron.schedule('0 9 * * *', () => run().catch(console.error));
  console.log('Reminder cron scheduled: 09:00 daily');
};
