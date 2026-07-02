/**
 * BackgroundOptions.jsx
 * Renders the correct controls for the selected mode:
 *   - 'remove'  → no extra options
 *   - 'color'   → colour picker + preset swatches
 *   - 'image'   → background image upload slot
 *
 * Props:
 *   mode        {'remove'|'color'|'image'}
 *   color       {string}     hex without '#' (for mode='color')
 *   onColor     {Function}   (hex) => void
 *   bgFile      {File|null}
 *   bgPreview   {string|null} data URL
 *   onBgFile    {Function}   (File) => void
 *   onRemoveBg  {Function}   () => void  — clears the background image
 */

import ImageUploader from './ImageUploader'

const SWATCHES = [
  { hex: 'FFFFFF', label: 'White',    style: 'bg-white' },
  { hex: '000000', label: 'Black',    style: 'bg-black border border-white/10' },
  { hex: 'F3F4F6', label: 'Light',    style: 'bg-gray-100' },
  { hex: '1E293B', label: 'Slate',    style: 'bg-slate-800' },
  { hex: '8B5CF6', label: 'Violet',   style: 'bg-violet-500' },
  { hex: '06B6D4', label: 'Cyan',     style: 'bg-cyan-500' },
  { hex: '10B981', label: 'Emerald',  style: 'bg-emerald-500' },
  { hex: 'F59E0B', label: 'Amber',    style: 'bg-amber-500' },
  { hex: 'F43F5E', label: 'Rose',     style: 'bg-rose-500' },
  { hex: '3B82F6', label: 'Blue',     style: 'bg-blue-500' },
]

export default function BackgroundOptions({ mode, color, onColor, bgFile, bgPreview, onBgFile, onRemoveBg }) {
  if (mode === 'remove') return null

  /* ── Colour mode ─────────────────────────────────────────────── */
  if (mode === 'color') {
    const rawHex = color.replace('#', '')

    function handleText(val) {
      const clean = val.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase()
      onColor(clean)
    }

    return (
      <section aria-label="Background colour options" className="mt-6 bg-[#1a1a26] border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <h3 className="text-[13px] font-semibold text-[#e8eaf6] flex items-center gap-2 m-0">
          🎨 <span>Background Colour</span>
        </h3>

        {/* Preset swatches */}
        <div className="flex flex-wrap gap-2">
          {SWATCHES.map(sw => (
            <button
              key={sw.hex}
              id={`swatch-${sw.hex}`}
              title={sw.label}
              className={[
                'swatch-btn w-8 h-8 rounded-lg transition-all duration-150',
                sw.style,
                rawHex === sw.hex
                  ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-[#1a1a26] scale-110'
                  : 'hover:scale-110 hover:ring-2 hover:ring-white/30',
              ].join(' ')}
              onClick={() => onColor(sw.hex)}
            />
          ))}
        </div>

        {/* Hex input */}
        <div className="flex items-center gap-3">
          {/* Native colour picker */}
          <label className="relative cursor-pointer" htmlFor="native-color-picker">
            <div
              className="w-10 h-10 rounded-lg border border-white/10 shadow-inner cursor-pointer overflow-hidden"
              style={{ background: rawHex.length === 6 ? `#${rawHex}` : '#ffffff' }}
            />
            <input
              id="native-color-picker"
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={rawHex.length === 6 ? `#${rawHex}` : '#ffffff'}
              onChange={e => onColor(e.target.value.replace('#', '').toUpperCase())}
            />
          </label>

          {/* Hex text input */}
          <div className="flex items-center gap-1.5 bg-[#12121a] border border-white/[0.13] rounded-xl px-3 py-2 flex-1">
            <span className="text-[#4b4e68] font-mono text-sm">#</span>
            <input
              id="color-hex-input"
              type="text"
              value={rawHex}
              onChange={e => handleText(e.target.value)}
              placeholder="FFFFFF"
              maxLength={6}
              spellCheck="false"
              className="bg-transparent border-none outline-none font-mono text-sm font-semibold text-[#e8eaf6] tracking-widest w-24 placeholder:text-[#4b4e68]"
            />
          </div>
        </div>
      </section>
    )
  }

  /* ── Image mode ──────────────────────────────────────────────── */
  if (mode === 'image') {
    return (
      <section aria-label="Background image options" className="mt-6 bg-[#1a1a26] border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <h3 className="text-[13px] font-semibold text-[#e8eaf6] flex items-center gap-2 m-0">
          🖼️ <span>Background Image</span>
        </h3>

        {!bgPreview ? (
          <ImageUploader
            id="bg-image"
            compact
            label="Drop background image"
            onFile={onBgFile}
          />
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img src={bgPreview} alt="Background" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#e8eaf6] m-0 truncate">
                {bgFile?.name ?? 'Background image'}
              </p>
              <p className="text-xs text-[#4b4e68] mt-0.5 m-0">
                {bgFile ? `${(bgFile.size / 1024 / 1024).toFixed(1)} MB` : ''}
                &nbsp;· Will be resized to fit
              </p>
            </div>
            <button
              id="btn-change-bg"
              className="text-xs text-violet-400 hover:text-violet-300 font-medium px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 transition-colors"
              onClick={onRemoveBg}
            >
              Change
            </button>
          </div>
        )}
      </section>
    )
  }

  return null
}
