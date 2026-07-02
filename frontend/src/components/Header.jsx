/**
 * Header.jsx — Glass-morphism navigation bar.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-lg shadow-lg group-hover:scale-105 transition-transform">
            ✨
          </div>
          <div>
            <span className="text-[17px] font-bold text-[#e8eaf6] tracking-tight">BG Remover</span>
            <span className="ml-2 text-[11px] text-[#a0a3b8] font-medium">Media Department</span>
          </div>
        </a>

        {/* Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-[11px] font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI Powered
          </div>
          <div className="hidden sm:block text-[12px] text-[#4b4e68]">rembg · u2net</div>
        </div>

      </div>
    </header>
  )
}
