import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { startReminderJob } from './jobs/reminderJob.js';

dotenv.config();
await connectDB();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use((err, _req, res, _next) => res.status(err.status||500).json({ message: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server on :${PORT}`); startReminderJob(); });
