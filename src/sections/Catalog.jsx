import { useEffect, useState } from 'react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

const normalize = (value) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'mousse', label: 'Mousse' },
  { id: 'galletas', label: 'Galletas' },
  { id: 'queque', label: 'Queque' },
  { id: 'brownie', label: 'Brownie' },
  { id: 'cheesecake', label: 'Cheesecake' },
  { id: 'trufas', label: 'Trufas' },
]

export default function Catalog() {
  const [active, setActive] = useState('todos')
  const [query, setQuery] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    const handler = (event) => {
      setActive('todos')
      setQuery(event.detail ?? '')
    }
    window.addEventListener('catalog-search', handler)
    return () => window.removeEventListener('catalog-search', handler)
  }, [])

  const searchTerm = normalize(query.trim())
  const filtered = products.filter((p) => {
    if (active !== 'todos' && p.category !== active) return false
    if (!searchTerm) return true
    const haystack = normalize([p.name, p.shortDesc, p.category, ...p.tags].join(' '))
    return haystack.includes(searchTerm)
  })

  return (
    <section id="producto" className="py-14">
      <div className="section">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl">Catálogo</h2>
          <p className="mt-2 text-marron/80">Nuestros postres saludables</p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActive(cat.id)
                setQuery('')
              }}
              aria-pressed={active === cat.id}
              className={"px-4 py-2 rounded-pill transition-all " + (active === cat.id ? 'bg-marron text-white shadow-soft' : 'bg-white text-marron shadow-soft hover:shadow-hover')}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 bg-white rounded-pill px-4 py-2 shadow-soft w-full max-w-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              aria-label="Buscar producto"
              className="bg-transparent outline-none flex-1"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="text-marron/60 hover:text-marron"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <article key={product.id} className="bg-white rounded-card-lg shadow-soft overflow-hidden flex flex-col">
              <div className="relative h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl">{product.name}</h3>
                <p className="mt-2 text-sm text-marron/80 flex-1">{product.shortDesc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-pill bg-salvia/20 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-fraunces text-lg">S/ {product.price.toFixed(2)}</div>
                  <button
                    onClick={() => {
                      addToCart(product)
                      window.dispatchEvent(new Event('open-cart'))
                    }}
                    aria-label={'Agregar ' + product.name + ' al pedido'}
                    className="px-4 py-2 rounded-pill bg-fresa text-white shadow-soft hover:shadow-hover transition-shadow"
                  >
                    Agregar al pedido
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center mt-10 text-marron/70">
            No hay productos que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </section>
  )
}
