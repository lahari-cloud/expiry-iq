import Tesseract from 'tesseract.js';
import sharp from 'sharp';
const PATTERNS = [
  /(exp(?:iry|ires)?|best before|use by|bb)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i,
  /(\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2})/,
  /(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
  /(\d{1,2}[ -][A-Za-z]{3,9}[ -]\d{2,4})/,
];
const MONTHS = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
const parseDate = (s) => {
  if (!s) return null;
  s = s.trim();
  if (/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(s)) { const [y,m,d]=s.split(/[-\/]/); return new Date(+y,+m-1,+d); }
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(s)) { const [a,b,c]=s.split(/[-\/]/); return new Date(c<100?2000+c:+c,+b-1,+a); }
  if (/^\d{1,2}[ -][a-z]{3,9}[ -]\d{2,4}$/i.test(s)) { const [d,m,y]=s.split(/[ -]/); const mo=MONTHS[m.slice(0,3).toLowerCase()]; if(mo!==undefined) return new Date(y<100?2000+y:+y,mo,+d); }
  return null;
};
export const extractExpiryDateFromImage = async (imgPath) => {
  const buf = await sharp(imgPath).grayscale().normalize().sharpen().toBuffer();
  const { data: { text } } = await Tesseract.recognize(buf, 'eng');
  let matched = null;
  for (const p of PATTERNS) { const m=text.match(p); if(m){ matched=(m[2]||m[1]).trim(); break; } }
  return { rawText: text, matchedText: matched, parsedDate: parseDate(matched) };
};
