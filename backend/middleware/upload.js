import { put } from '@vercel/blob';
import multer from 'multer';
import path from 'path';

const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for Blob upload
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadToBlob = async (req, res, next) => {
  if (!req.files || !req.files.cnicFront || !req.files.cnicBack) {
    return next();
  }

  try {
    const cnicFront = await put(`${req.files.cnicFront[0].originalname}-${Date.now()}${path.extname(req.files.cnicFront[0].originalname)}`, req.files.cnicFront[0].buffer, {
      access: 'public'
    });
    const cnicBack = await put(`${req.files.cnicBack[0].originalname}-${Date.now()}${path.extname(req.files.cnicBack[0].originalname)}`, req.files.cnicBack[0].buffer, {
      access: 'public'
    });

    req.files.cnicFront[0].url = cnicFront.url;
    req.files.cnicBack[0].url = cnicBack.url;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'File upload to Blob failed', error: error.message });
  }
};

export default upload;