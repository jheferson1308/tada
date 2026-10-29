import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'
import { config } from '../config'

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement
    closeButtonRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = [...panelRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter((el) => el.offsetParent !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [open])

  const goToSection = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToOrder = () => goToSection('hacer-pedido')

  const sendWhatsApp = () => {
    if (items.length === 0) return
    const lines = items.map(
      (item) => '- ' + item.name + ' x' + item.qty + ' = S/ ' + (item.price * item.qty).toFixed(2)
    )
    const messageParts = [
      'Hola! Quisiera hacer un pedido en ' + config.businessName + ':',
      ...lines,
      'Total: S/ ' + total.toFixed(2),
      config.anticipation,
    ]
    const message = encodeURIComponent(messageParts.join('\n'))
    const url = 'https://wa.me/' + config.whatsapp + '?text=' + message
    const popup = window.open(url, '_blank')
    if (!popup) window.location.href = url
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 bg-marron/40" onClick={() => setOpen(false)}></div>
      <div ref={panelRef} className="absolute right-0 top-0 h-full w-full max-w-md bg-crema shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-durazno">
          <div className="font-fraunces uppercase">Carrito</div>
          <button
            ref={closeButtonRef}
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            className="p-2 rounded-full hover:bg-durazno/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center text-marron/70 mt-10">
              <p>Tu carrito está vacío</p>
              <button
                onClick={() => goToSection('producto')}
                className="mt-4 px-5 py-2 rounded-pill bg-marron text-white shadow-soft"
              >
                VER PRODUCTOS
              </button>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 bg-white rounded-card p-3 shadow-soft">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-card" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-marron/70">S/ {item.price.toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    aria-label={'Quitar una unidad de ' + item.name}
                    className="w-8 h-8 rounded-pill bg-durazno"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label={'Agregar una unidad de ' + item.name}
                    className="w-8 h-8 rounded-pill bg-durazno"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={'Quitar ' + item.name + ' del carrito'}
                    className="ml-auto text-sm text-fresa"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-durazno space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-fraunces text-lg">S/ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={sendWhatsApp}
              className="w-full py-3 rounded-pill bg-fresa text-white shadow-soft hover:shadow-hover transition-shadow"
            >
              PEDIR POR WHATSAPP
            </button>
            <button
              onClick={goToOrder}
              className="w-full py-3 rounded-pill bg-marron text-white shadow-soft hover:shadow-hover transition-shadow"
            >
              CONTINUAR PEDIDO
            </button>
            <button onClick={clearCart} className="w-full py-2 text-sm text-marron/70">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
