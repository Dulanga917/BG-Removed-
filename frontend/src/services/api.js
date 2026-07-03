/**
 * api.js — Direct client for the FastAPI AI Server.
 * Calls the Python AI server directly — no Node.js backend needed.
 *
 *   Development (.env):            VITE_API_BASE_URL=http://localhost:8000
 *   Production (.env.production):  VITE_API_BASE_URL=https://bg-remover-ai-server.onrender.com
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * POST a multipart FormData to the AI server and return a blob URL of the image.
 */
async function postForm(path, fd) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', body: fd })
  if (!res.ok) {
    const text = await res.text().catch(() => 'Request failed')
    throw new Error(text || `Server error ${res.status}`)
  }
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

/**
 * Remove background from an image — returns transparent PNG blob URL.
 */
export async function removeBg(file) {
  const fd = new FormData()
  fd.append('file', file)
  const originalUrl  = URL.createObjectURL(file)
  const processedUrl = await postForm('/api/remove-background', fd)
  return { originalUrl, processedUrl }
}

/**
 * Remove background and replace with a solid hex colour.
 * @param {string} color  - 6-char hex WITHOUT '#' (e.g. 'FF0000')
 */
export async function replaceBgColor(file, color) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('color', color)
  const originalUrl  = URL.createObjectURL(file)
  const processedUrl = await postForm('/api/replace-background-color', fd)
  return { originalUrl, processedUrl }
}

/**
 * Remove background and composite onto a custom background image.
 */
export async function replaceBgImage(file, bgImageFile) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('background', bgImageFile)
  const originalUrl  = URL.createObjectURL(file)
  const processedUrl = await postForm('/api/replace-background-image', fd)
  return { originalUrl, processedUrl }
}

/**
 * Return the URL for displaying an image.
 * Now using blob URLs — just return as-is.
 */
export function getImageUrl(url) {
  return url || ''
}

/**
 * Return the download URL for a processed image.
 * Now using blob URLs — just return as-is.
 */
export function getDownloadUrl(url) {
  return url || ''
}
