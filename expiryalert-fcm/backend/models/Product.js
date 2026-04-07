import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['food','medicine','personal-care','other'], default: 'other' },
  expiryDate: { type: Date, required: true },
  imageUrl: { type: String, default: '' },
  ocrRawText: { type: String, default: '' },
  reminderHistory: {
    sevenDaySent: { type: Boolean, default: false },
    threeDaySent:  { type: Boolean, default: false },
    sameDaySent:   { type: Boolean, default: false },
  },
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
