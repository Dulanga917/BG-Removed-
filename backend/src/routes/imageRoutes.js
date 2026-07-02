import { Router } from 'express';
import path from 'path';
import { uploadSingle, uploadWithBackground } from '../middleware/upload.js';
import { removeBg, replaceBgColor, replaceBgImage } from '../controllers/imageController.js';
import config from '../config.js';

const router = Router();

// Background removal
router.post('/remove-bg', uploadSingle, removeBg);

// Background replacement with solid color
router.post('/replace-bg-color', uploadSingle, replaceBgColor);

// Background replacement with another image
router.post('/replace-bg-image', uploadWithBackground, replaceBgImage);

// Download a processed file as an attachment
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;

  // Sanitize filename to prevent directory traversal
  const sanitized = path.basename(filename);
  const filePath = path.join(config.PROCESSED_DIR, sanitized);

  res.download(filePath, sanitized, (err) => {
    if (err) {
      console.error('Download error:', err.message);
      if (!res.headersSent) {
        res.status(404).json({ success: false, error: 'File not found' });
      }
    }
  });
});

export default router;
