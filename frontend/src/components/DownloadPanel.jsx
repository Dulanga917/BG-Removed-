import { getDownloadUrl, getImageUrl } from '../services/api'

/**
 * DownloadPanel — shows download buttons after a successful processing.
 *
 * Props:
 *   processedUrl  {string}   relative URL from the backend, e.g. '/processed/abc.png'
 *   onReset       {Function} () => void — clears state so user can start fresh
 */
export default function DownloadPanel({ processedUrl, onReset }) {
  const downloadUrl = getDownloadUrl(processedUrl)
  const previewUrl  = getImageUrl(processedUrl)

  /* PNG download via anchor tag */
  function downloadPng() {
    const a = document.createElement('a')
    a.href     = downloadUrl
    a.download = `bg-removed-${processedUrl.split('/').pop()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  /* JPG download — draw the PNG onto a white canvas, then save as JPEG */
  async function downloadJpg() {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas  = document.createElement('canvas')
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      const a = document.createElement('a')
      a.href     = canvas.toDataURL('image/jpeg', 0.92)
      a.download = `bg-removed-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    img.src = previewUrl
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-6 fade-up">

      {/* Success header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-xl">
          ✅
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#e8eaf6] m-0">Background removed!</p>
          <p className="text-[12px] text-[#4b4e68] m-0">Download your image below</p>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          id="btn-download-png"
          onClick={downloadPng}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold text-[14px] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-500/20 active:translate-y-0"
        >
          ⬇️ Download PNG
          <span className="text-[11px] font-normal opacity-70">(transparent)</span>
        </button>

        <button
          id="btn-download-jpg"
          onClick={downloadJpg}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1a26] border border-white/[0.13] hover:border-violet-500/40 text-[#e8eaf6] font-semibold text-[14px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          ⬇️ Download JPG
          <span className="text-[11px] font-normal text-[#4b4e68]">(white bg)</span>
        </button>

        <button
          id="btn-process-another"
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12121a] border border-white/[0.07] hover:border-white/[0.15] text-[#a0a3b8] font-semibold text-[14px] transition-all duration-200 ml-auto"
        >
          ↩ Process Another
        </button>
      </div>

    </div>
  )
}
