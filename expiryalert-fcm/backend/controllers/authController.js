import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'Invalid credentials' });
  res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
};

export const me = async (req, res) => res.json(req.user);

export const saveFcmToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { fcmTokens: token } });
  res.json({ message: 'FCM token saved' });
};

export const removeFcmToken = async (req, res) => {
  const { token } = req.body;
  await User.findByIdAndUpdate(req.user._id, { $pull: { fcmTokens: token } });
  res.json({ message: 'FCM token removed' });
};
