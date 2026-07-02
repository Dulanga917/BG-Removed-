import { useRef, useState } from 'react'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/bmp'

/**
 * ImageUploader — drag-and-drop + click-to-browse upload zone.
 *
 * Props:
 *   id        {string}    - unique id prefix (for label/input)
 *   onFile    {Function}  - called with (File)
 *   compact   {boolean}   - smaller variant for background image slot
 *   label     {string}    - overrides the default title text
 */
export default function ImageUploader({ id = 'upload', onFile, compact = false, label }) {
  const inputRef = useState(null)
  const ref      = useRef(null)
  const [dragging, setDragging] = useState(false)

  function pick(file) {
    if (!file || !file.type.startsWith('image/')) return
    onFile?.(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files?.[0])
  }

  return (
    <div
      id={`${id}-dropzone`}
      role="button"
      tabIndex={0}
      aria-label={label ?? 'Upload image'}
      className={[
        'relative flex flex-col items-center justify-center text-center cursor-pointer',
        'border-2 border-dashed rounded-2xl transition-all duration-200',
        'bg-[#12121a] overflow-hidden',
        dragging
          ? 'border-violet-500 bg-violet-500/5 scale-[1.01]'
          : 'border-white/[0.13] hover:border-violet-500/50 hover:bg-violet-500/[0.03]',
        compact ? 'p-8 gap-3' : 'p-16 gap-4',
      ].join(' ')}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => ref.current?.click()}
      onKeyDown={e => e.key === 'Enter' && ref.current?.click()}
    >
      {/* Hidden file input */}
      <input
        ref={ref}
        id={`${id}-input`}
        type="file"
        accept={ACCEPTED}
        className="sr-only"
        onChange={e => pick(e.target.files?.[0])}
      />

      {/* Glow blob */}
      {dragging && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />
      )}

      {/* Icon */}
      <div className={[
        'rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center transition-transform',
        compact ? 'w-12 h-12 text-2xl' : 'w-20 h-20 text-4xl',
        dragging ? 'scale-110' : '',
      ].join(' ')}>
        {compact ? '🌄' : '🖼️'}
      </div>

      {/* Text */}
      <div>
        <p className={[
          'font-semibold text-[#e8eaf6] m-0',
          compact ? 'text-[14px]' : 'text-[18px]',
        ].join(' ')}>
          {label ?? (dragging ? 'Drop it!' : 'Drop image here')}
        </p>
        {!compact && (
          <p className="text-[13px] text-[#4b4e68] mt-1 m-0">
            or <span className="text-violet-400 font-medium">click to browse</span>
            &nbsp;· JPG, PNG, WEBP, BMP up to 20 MB
          </p>
        )}
        {compact && (
          <p className="text-[12px] text-[#4b4e68] mt-1 m-0">
            <span className="text-violet-400 font-medium">Click to browse</span>
          </p>
        )}
      </div>
    </div>
  )
}
