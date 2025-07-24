import multer from 'multer';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Ensure the /tmp/uploads/ directory exists
const uploadDir = '/tmp/uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PNG and JPG images are allowed'));
  }
});

export const saveProductImagesToBlob = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const imageUrls = [];
    for (const file of req.files) {
      const fileBuffer = fs.readFileSync(file.path); // Read the file from disk
      const { url } = await put(`product-wish/${uuidv4()}-${file.originalname}`, fileBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true
      });
      imageUrls.push(url);
      // Clean up the temporary file
      fs.unlinkSync(file.path);
    }

    req.body.imageUrls = imageUrls;
    next();
  } catch (error) {
    console.error('Product image upload error:', error);
    res.status(500).json({ message: 'Product image upload error', error: error.message });
  }
};

export default upload.array('images', 5);