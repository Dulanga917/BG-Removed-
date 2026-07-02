import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import config from '../config.js';

/**
 * POST /api/images/remove-bg
 * Removes the background from an uploaded image.
 */
export async function removeBg(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalFilename = req.file.filename;

    const form = new FormData();
    form.append('file', createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      `${config.AI_SERVER_URL}/api/remove-background`,
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const processedFilename = `${uuidv4()}.png`;
    const processedPath = path.join(config.PROCESSED_DIR, processedFilename);
    await fs.writeFile(processedPath, response.data);

    return res.json({
      success: true,
      originalUrl: `/uploads/${originalFilename}`,
      processedUrl: `/processed/${processedFilename}`,
    });
  } catch (error) {
    console.error('removeBg error:', error.message);
    const status = error.response?.status || 500;
    return res.status(status).json({
      success: false,
      error: error.response?.data
        ? Buffer.from(error.response.data).toString('utf-8')
        : error.message,
    });
  }
}

/**
 * POST /api/images/replace-bg-color
 * Replaces the background with a solid color.
 */
export async function replaceBgColor(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalFilename = req.file.filename;
    const color = req.body.color || 'FFFFFF';

    const form = new FormData();
    form.append('file', createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    form.append('color', color);

    const response = await axios.post(
      `${config.AI_SERVER_URL}/api/replace-background-color`,
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const processedFilename = `${uuidv4()}.png`;
    const processedPath = path.join(config.PROCESSED_DIR, processedFilename);
    await fs.writeFile(processedPath, response.data);

    return res.json({
      success: true,
      originalUrl: `/uploads/${originalFilename}`,
      processedUrl: `/processed/${processedFilename}`,
    });
  } catch (error) {
    console.error('replaceBgColor error:', error.message);
    const status = error.response?.status || 500;
    return res.status(status).json({
      success: false,
      error: error.response?.data
        ? Buffer.from(error.response.data).toString('utf-8')
        : error.message,
    });
  }
}

/**
 * POST /api/images/replace-bg-image
 * Replaces the background with another image.
 */
export async function replaceBgImage(req, res) {
  try {
    if (!req.files?.file?.[0]) {
      return res.status(400).json({ success: false, error: 'No main file uploaded' });
    }
    if (!req.files?.background?.[0]) {
      return res.status(400).json({ success: false, error: 'No background file uploaded' });
    }

    const mainFile = req.files.file[0];
    const bgFile = req.files.background[0];
    const originalFilename = mainFile.filename;

    const form = new FormData();
    form.append('file', createReadStream(mainFile.path), {
      filename: mainFile.originalname,
      contentType: mainFile.mimetype,
    });
    form.append('background', createReadStream(bgFile.path), {
      filename: bgFile.originalname,
      contentType: bgFile.mimetype,
    });

    const response = await axios.post(
      `${config.AI_SERVER_URL}/api/replace-background-image`,
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const processedFilename = `${uuidv4()}.png`;
    const processedPath = path.join(config.PROCESSED_DIR, processedFilename);
    await fs.writeFile(processedPath, response.data);

    return res.json({
      success: true,
      originalUrl: `/uploads/${originalFilename}`,
      processedUrl: `/processed/${processedFilename}`,
    });
  } catch (error) {
    console.error('replaceBgImage error:', error.message);
    const status = error.response?.status || 500;
    return res.status(status).json({
      success: false,
      error: error.response?.data
        ? Buffer.from(error.response.data).toString('utf-8')
        : error.message,
    });
  }
}
