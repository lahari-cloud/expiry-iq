import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fcmTokens: { type: [String], default: [] },
  notifyEmail: { type: Boolean, default: true },
  notifyPush: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('User', userSchema);
