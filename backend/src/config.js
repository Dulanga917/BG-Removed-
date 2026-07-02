import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  PORT: process.env.PORT || 5000,
  AI_SERVER_URL: process.env.AI_SERVER_URL || 'http://localhost:8000',
  UPLOAD_DIR: path.resolve(__dirname, '../uploads'),
  PROCESSED_DIR: path.resolve(__dirname, '../processed'),
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'],
};

export default config;
