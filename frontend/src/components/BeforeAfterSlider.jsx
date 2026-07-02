import { useState, useRef, useCallback } from 'react'

/**
 * BeforeAfterSlider — interactive drag slider for comparing two images.
 *
 * Props:
 *   before  {string}  URL of the original image
 *   after   {string}  URL of the processed image
 */
export default function BeforeAfterSlider({ before, after }) {
  const [pos, setPos] = useState(50)        // 0–100 percent
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  /* Mouse */
  const onMouseDown = () => { dragging.current = true }
  const onMouseMove = (e) => { if (dragging.current) updatePos(e.clientX) }
  const onMouseUp   = () => { dragging.current = false }

  /* Touch */
  const onTouchMove = (e) => updatePos(e.touches[0].clientX)

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl select-none cursor-ew-resize checkerboard"
      style={{ minHeight: 240 }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* After image (full width underneath) */}
      <img
        src={after}
        alt="Processed"
        className="w-full h-full object-contain block"
        draggable={false}
      />

      {/* Before image (clipped to left side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.8)] pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[11px] font-bold cursor-ew-resize z-10"
        style={{ left: `${pos}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={() => {}}
      >
        ↔
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md">
        BEFORE
      </div>
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md">
        AFTER
      </div>

      {/* Range input for accessibility */}
      <input
        id="slider-range"
        type="range"
        min={0} max={100}
        value={pos}
        onChange={e => setPos(Number(e.target.value))}
        className="slider-thumb absolute inset-0 w-full h-full opacity-0"
        aria-label="Before/after comparison"
      />
    </div>
  )
}
