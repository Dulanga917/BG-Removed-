import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  if (config.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: ${config.ALLOWED_TYPES.join(', ')}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
});

export const uploadSingle = upload.single('file');

export const uploadWithBackground = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]);
