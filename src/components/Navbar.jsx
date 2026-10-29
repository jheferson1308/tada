import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { config } from '../config'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')
  const [query, setQuery] = useState('')
  const { count } = useCart()

  useEffect(() => {
    const sections = ['inicio', 'producto', 'galeria', 'hacer-pedido', 'acerca-de']
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActive(sections[i])
            break
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'producto', label: 'PRODUCTO' },
    { id: 'galeria', label: 'GALERÍA' },
    { id: 'hacer-pedido', label: 'HACER PEDIDO' },
    { id: 'acerca-de', label: 'ACERCA DE' },
  ]

  const submitSearch = (event) => {
    event.preventDefault()
    window.dispatchEvent(new CustomEvent('catalog-search', { detail: query.trim() }))
    document.getElementById('producto')?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header
      className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (scrolled ? 'bg-crema/80 backdrop-blur-md shadow-soft' : 'bg-transparent')}
    >
      <nav className="section flex items-center gap-2 sm:gap-3 xl:gap-4 py-3">
        <a
          href="#inicio"
          className="flex-shrink-0 font-fraunces text-sm sm:text-base xl:text-lg tracking-[0.12em] sm:tracking-[0.15em] xl:tracking-[0.25em] uppercase text-marron"
        >
          {config.businessName}
        </a>
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 xl:ml-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={'#' + link.id}
              className={"text-sm tracking-widest uppercase whitespace-nowrap " + (active === link.id ? 'text-fresa font-semibold' : 'text-marron/80 hover:text-marron')}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex-1"></div>
        <form onSubmit={submitSearch} className="hidden md:flex items-center gap-2 bg-white/70 rounded-pill px-3 py-1.5 shadow-soft">
          <button type="submit" aria-label="Buscar" className="flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            aria-label="Buscar productos"
            className="bg-transparent outline-none text-sm w-24 xl:w-28"
          />
        </form>
        <button
          onClick={() => window.dispatchEvent(new Event('open-cart'))}
          className="relative p-2 rounded-full hover:bg-durazno/60 transition-colors"
          aria-label={count > 0 ? 'Carrito, ' + count + (count === 1 ? ' producto' : ' productos') : 'Carrito'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.66 17h8.66a2 2 0 0 0 1.97-1.61L23 6H6"></path>
          </svg>
          {count > 0 && (
            <span aria-hidden="true" className="absolute -top-1 -right-1 bg-fresa text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-full hover:bg-durazno/60 transition-colors"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="lg:hidden bg-crema/95 backdrop-blur-md border-t border-durazno">
          <div className="section flex flex-col gap-3 py-4">
            <form onSubmit={submitSearch} className="flex items-center gap-2 bg-white rounded-pill px-4 py-2 shadow-soft md:hidden">
              <button type="submit" aria-label="Buscar" className="flex items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                aria-label="Buscar productos"
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </form>
            {links.map((link) => (
              <a
                key={link.id}
                href={'#' + link.id}
                onClick={() => setOpen(false)}
                className={"text-sm tracking-widest uppercase " + (active === link.id ? 'text-fresa font-semibold' : 'text-marron')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
