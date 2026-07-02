import { useState, useRef, useCallback } from 'react'
import ImageUploader    from '../components/ImageUploader'
import BackgroundOptions from '../components/BackgroundOptions'
import ImagePreview     from '../components/ImagePreview'
import DownloadPanel    from '../components/DownloadPanel'
import { removeBg, replaceBgColor, replaceBgImage } from '../services/api'

const MODES = [
  { id: 'remove', icon: '✂️', label: 'Remove Background',       desc: 'Get a clean transparent PNG' },
  { id: 'color',  icon: '🎨', label: 'Replace with Colour',     desc: 'Set a solid colour backdrop'  },
  { id: 'image',  icon: '🖼️', label: 'Replace with Image',      desc: 'Composite a custom background'},
]

export default function Home() {
  /* ── State ──────────────────────────────────────────────────── */
  const [mode, setMode]           = useState('remove')
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)      // data URL (for local preview before processing)
  const [bgFile, setBgFile]       = useState(null)
  const [bgPreview, setBgPreview] = useState(null)
  const [color, setColor]         = useState('FFFFFF')
  const [result, setResult]       = useState(null)      // { originalUrl, processedUrl }
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  /* ── Helpers ─────────────────────────────────────────────────── */
  function readFile(f, setF, setPrev) {
    setF(f)
    const r = new FileReader()
    r.onload = e => setPrev(e.target.result)
    r.readAsDataURL(f)
  }

  function handleMainFile(f) {
    readFile(f, setFile, setPreview)
    setResult(null)
    setError(null)
  }

  function handleBgFile(f) {
    readFile(f, setBgFile, setBgPreview)
  }

  function reset() {
    setFile(null); setPreview(null)
    setBgFile(null); setBgPreview(null)
    setResult(null); setError(null)
    setLoading(false)
  }

  function switchMode(m) {
    setMode(m)
    setResult(null)
    setError(null)
  }

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleProcess = useCallback(async () => {
    if (!file) return
    if (mode === 'image' && !bgFile) {
      setError('Please upload a background image before processing.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let json
      if      (mode === 'remove') json = await removeBg(file)
      else if (mode === 'color')  json = await replaceBgColor(file, color)
      else                        json = await replaceBgImage(file, bgFile)
      setResult(json)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [file, bgFile, mode, color])

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-20">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="text-center pt-16 pb-12 fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-Powered · Works Offline · Free
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#e8eaf6] tracking-tight leading-[1.1] m-0 mb-4">
          Remove Backgrounds<br />
          <span className="gradient-text">Instantly</span>
        </h1>
        <p className="text-[17px] text-[#a0a3b8] max-w-md mx-auto leading-relaxed m-0">
          Drop any photo — our local AI model strips the background in seconds.
          No cloud, no limits, no cost.
        </p>
      </div>

      {/* ── Mode Tabs ────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Processing mode"
        className="flex gap-2 bg-[#12121a] border border-white/[0.07] rounded-2xl p-1.5 mb-6"
      >
        {MODES.map(m => (
          <button
            key={m.id}
            id={`tab-${m.id}`}
            role="tab"
            aria-selected={mode === m.id}
            className={[
              'flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2',
              'px-3 py-3 sm:py-2.5 rounded-xl font-medium text-[13px] sm:text-[14px]',
              'transition-all duration-200 border',
              mode === m.id
                ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white border-transparent shadow-lg shadow-violet-500/20'
                : 'text-[#a0a3b8] border-transparent hover:text-[#e8eaf6] hover:bg-white/[0.04]',
            ].join(' ')}
            onClick={() => switchMode(m.id)}
          >
            <span>{m.icon}</span>
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden text-[11px] font-normal opacity-70 text-center leading-tight">{m.label}</span>
          </button>
        ))}
      </div>

      {/* ── Upload / Work Area ───────────────────────────────────── */}
      {!file ? (
        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          <ImageUploader id="main" onFile={handleMainFile} />

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              ['⚡','Instant results'],
              ['🔒','100% local'],
              ['📦','PNG export'],
              ['🖼️','Custom backgrounds'],
            ].map(([icon, text]) => (
              <span key={text} className="flex items-center gap-1.5 text-[12px] text-[#4b4e68] bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
                {icon} {text}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="fade-up">
          {/* Selected file info */}
          <div className="flex items-center gap-3 mb-5 bg-[#1a1a26] border border-white/[0.07] rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
              <img src={preview} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#e8eaf6] m-0 truncate">{file.name}</p>
              <p className="text-xs text-[#4b4e68] m-0">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              id="btn-change-image"
              onClick={reset}
              className="text-xs text-[#4b4e68] hover:text-[#a0a3b8] font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] transition-colors flex-shrink-0"
            >
              Change
            </button>
          </div>

          {/* Background options */}
          <BackgroundOptions
            mode={mode}
            color={color}
            onColor={setColor}
            bgFile={bgFile}
            bgPreview={bgPreview}
            onBgFile={handleBgFile}
            onRemoveBg={() => { setBgFile(null); setBgPreview(null) }}
          />

          {/* Error banner */}
          {error && (
            <div className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Process button */}
          {!result && (
            <button
              id="btn-process"
              onClick={handleProcess}
              disabled={loading || (mode === 'image' && !bgFile)}
              className={[
                'mt-6 w-full flex items-center justify-center gap-3 py-4 rounded-2xl',
                'text-white font-bold text-[16px] tracking-tight',
                'transition-all duration-200',
                loading || (mode === 'image' && !bgFile)
                  ? 'bg-violet-700/40 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0',
              ].join(' ')}
            >
              {loading ? (
                <><span className="spinner" /> Processing your image…</>
              ) : (
                <>✨ {MODES.find(m => m.id === mode)?.label}</>
              )}
            </button>
          )}

          {/* Results */}
          {(result || loading) && (
            <>
              <ImagePreview
                originalUrl={result?.originalUrl ?? ''}
                processedUrl={result?.processedUrl ?? ''}
                loading={loading}
              />
              {result && !loading && (
                <DownloadPanel processedUrl={result.processedUrl} onReset={reset} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
