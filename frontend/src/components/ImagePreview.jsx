import BeforeAfterSlider from './BeforeAfterSlider'
import { getImageUrl } from '../services/api'

/**
 * ImagePreview — shows the original + result side-by-side,
 * and the before/after interactive slider below.
 *
 * Props:
 *   originalUrl   {string}   relative URL e.g. '/uploads/foo.png'
 *   processedUrl  {string}   relative URL e.g. '/processed/bar.png'
 *   loading       {boolean}
 */
export default function ImagePreview({ originalUrl, processedUrl, loading }) {
  const origSrc  = getImageUrl(originalUrl)
  const procSrc  = getImageUrl(processedUrl)

  return (
    <div className="mt-8 space-y-6 fade-up">
      {/* ── Side-by-side cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-[#1a1a26] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
            <span className="w-2 h-2 rounded-full bg-[#4b4e68]" />
            <span className="text-[11px] font-semibold text-[#4b4e68] uppercase tracking-wider">Original</span>
          </div>
          <div className="checkerboard flex items-center justify-center p-4 min-h-[220px]">
            <img
              src={origSrc}
              alt="Original"
              className="max-w-full max-h-72 object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Processed */}
        <div className="bg-[#1a1a26] border border-violet-500/20 rounded-2xl overflow-hidden relative">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Processed</span>
          </div>
          <div className="checkerboard flex items-center justify-center p-4 min-h-[220px]">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-[#4b4e68]">
                <div className="spinner spinner-lg" />
                <span className="text-sm">AI processing…</span>
              </div>
            ) : (
              <img
                src={procSrc}
                alt="Processed"
                className="max-w-full max-h-72 object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Before / after slider ──────────────────────────────── */}
      {!loading && (
        <div className="bg-[#1a1a26] border border-white/[0.07] rounded-2xl overflow-hidden p-4">
          <p className="text-[11px] font-semibold text-[#4b4e68] uppercase tracking-wider mb-3">
            Before / After Comparison
          </p>
          <BeforeAfterSlider before={origSrc} after={procSrc} />
        </div>
      )}
    </div>
  )
}
