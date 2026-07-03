/**
 * api.js — Axios-based API client for the BgClear backend.
 * BASE_URL is set via environment variable:
 *   - Development (.env):            VITE_API_BASE_URL=http://localhost:5000
 *   - Production (.env.production):  VITE_API_BASE_URL=https://your-backend.onrender.com
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/**
 * Internal helper — submit a multipart FormData and return the parsed JSON.
 * @param {string} path  - endpoint path (e.g. '/api/images/remove-bg')
 * @param {FormData} fd  - form data to POST
 */
async function postForm(path, fd) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', body: fd })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error || 'Request failed')
  return json               // { success, originalUrl, processedUrl }
}

/**
 * Remove background from an image.
 * @param {File} file
 * @returns {{ originalUrl: string, processedUrl: string }}
 */
export async function removeBg(file) {
  const fd = new FormData()
  fd.append('file', file)
  return postForm('/api/images/remove-bg', fd)
}

/**
 * Remove background and replace with a solid hex colour.
 * @param {File}   file
 * @param {string} color  - 6-char hex WITHOUT '#' (e.g. 'FF0000')
 * @returns {{ originalUrl: string, processedUrl: string }}
 */
export async function replaceBgColor(file, color) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('color', color)
  return postForm('/api/images/replace-bg-color', fd)
}

/**
 * Remove background and composite onto a custom background image.
 * @param {File} file        - foreground image
 * @param {File} bgImageFile - background image
 * @returns {{ originalUrl: string, processedUrl: string }}
 */
export async function replaceBgImage(file, bgImageFile) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('background', bgImageFile)
  return postForm('/api/images/replace-bg-image', fd)
}

/**
 * Build a direct download URL for a processed file.
 * The backend serves files as an attachment via GET /api/images/download/:filename.
 * @param {string} processedUrl  - e.g. '/processed/abc-123.png'
 * @returns {string}             - full download URL
 */
export function getDownloadUrl(processedUrl) {
  const filename = processedUrl.split('/').pop()
  return `${BASE_URL}/api/images/download/${filename}`
}

/**
 * Build a full URL for previewing a processed/original image served by the backend.
 * @param {string} relativeUrl  - e.g. '/processed/abc-123.png'
 * @returns {string}
 */
export function getImageUrl(relativeUrl) {
  return `${BASE_URL}${relativeUrl}`
}
