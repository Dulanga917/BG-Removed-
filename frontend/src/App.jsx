import './App.css'
import Header from './components/Header'
import Home from './pages/Home'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <Header />
      <main className="flex-1">
        <Home />
      </main>
      <footer className="border-t border-white/[0.06] py-6 text-center text-[12px] text-[#4b4e68]">
        BG Remover — ID Department &nbsp;·&nbsp; Powered by rembg + FastAPI + React
      </footer>
    </div>
  )
}
