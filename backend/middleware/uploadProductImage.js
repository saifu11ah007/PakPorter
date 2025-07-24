import multer from 'multer';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

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
    fileSize: 5 * 1024 * 1024,
    files: 5
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
    // Initialize imageUrls as empty array
    req.body.imageUrls = [];
    
    // Only process if files exist and have length > 0
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      
      for (const file of req.files) {
        try {
          const fileBuffer = fs.readFileSync(file.path);
          const { url } = await put(`product-wish/${uuidv4()}-${file.originalname}`, fileBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: true
          });
          
          // Only add valid URLs
          if (url && typeof url === 'string' && url.trim() !== '') {
            imageUrls.push(url);
          }
          
          // Clean up temp file
          fs.unlinkSync(file.path);
        } catch (fileError) {
          console.error('Error processing file:', file.filename, fileError);
          // Clean up temp file even if processing failed
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }

      req.body.imageUrls = imageUrls;
    }

    console.log('Processed image URLs:', req.body.imageUrls); // Debug log
    next();
  } catch (error) {
    console.error('Product image upload error:', error);
    
    // Clean up any remaining temp files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ message: 'Product image upload error', error: error.message });
  }
};

export default upload.array('images', 5);