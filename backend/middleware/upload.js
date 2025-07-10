import multer from 'multer';
       import { put } from '@vercel/blob';

       const upload = multer({
         storage: multer.memoryStorage(),
       });

       export const uploadMiddleware = upload.fields([
         { name: 'cnicFront', maxCount: 1 },
         { name: 'cnicBack', maxCount: 1 },
       ]);

       export const saveToBlob = async (req, res, next) => {
         try {
           if (req.files.cnicFront) {
             const { url } = await put(`cnicFront-${Date.now()}.jpg`, req.files.cnicFront[0].buffer, {
               access: 'public',
               token: process.env.BLOB_READ_WRITE_TOKEN,
               addRandomSuffix: true
             });
             req.files.cnicFront[0].key = url;
           }
           if (req.files.cnicBack) {
             const { url } = await put(`cnicBack-${Date.now()}.jpg`, req.files.cnicBack[0].buffer, {
               access: 'public',
               token: process.env.BLOB_READ_WRITE_TOKEN,
               addRandomSuffix: true
             });
             req.files.cnicBack[0].key = url;
           }
           next();
         } catch (error) {
           console.error('Blob upload error:', error);
           res.status(500).json({ message: 'File upload error', error: error.message });
         }
       };

       export default uploadMiddleware;