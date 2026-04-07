import path from 'path';
import Product from '../models/Product.js';
import { extractExpiryDateFromImage } from '../services/ocrService.js';

export const scan = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image required' });
  const result = await extractExpiryDateFromImage(req.file.path);
  res.json({ imageUrl: `/uploads/${req.file.filename}`, rawText: result.rawText, matchedText: result.matchedText, extractedDate: result.parsedDate });
};

export const create = async (req, res) => {
  const { name, category, expiryDate, imageUrl, ocrRawText } = req.body;
  if (!name || !expiryDate) return res.status(400).json({ message: 'name & expiryDate required' });
  const product = await Product.create({ user: req.user._id, name, category, expiryDate, imageUrl, ocrRawText });
  res.status(201).json(product);
};

export const list = async (req, res) => {
  const products = await Product.find({ user: req.user._id }).sort({ expiryDate: 1 });
  const now = new Date();
  const summary = products.reduce((acc, p) => {
    const diff = Math.ceil((new Date(p.expiryDate) - now) / 86400000);
    acc.total++;
    if (diff < 0) acc.expired++;
    else if (diff <= 7) acc.expiringSoon++;
    return acc;
  }, { total: 0, expiringSoon: 0, expired: 0 });
  res.json({ products, summary });
};

export const update = async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const remove = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.deleteOne();
  res.json({ message: 'Deleted' });
};
