import { useCart } from '../context/CartContext'
import { products } from '../data/products'

export default function Featured() {
  const { addToCart } = useCart()
  const featured = products.filter((p) => p.featured).slice(0, 3)

  const items = [
    { num: '01', product: featured[0] },
    { num: '02', product: featured[1] },
    { num: '03', product: featured[2] },
  ].filter((i) => i.product)

  return (
    <section aria-label="Productos destacados" className="py-10">
      <div className="section grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <article
            key={item.product.id}
            className="relative overflow-hidden rounded-card-lg shadow-soft h-[320px] group"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-marron/90 via-marron/40 to-transparent"></div>
            <div className="absolute top-4 left-4 text-white/90 font-fraunces text-2xl">{item.num}</div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white text-2xl">{item.product.name}</h3>
              <div className="mt-1 text-white/90">S/ {item.product.price.toFixed(2)}</div>
              <button
                onClick={() => {
                  addToCart(item.product)
                  window.dispatchEvent(new Event('open-cart'))
                }}
                aria-label={'Agregar ' + item.product.name + ' al pedido'}
                className="mt-3 px-4 py-2 rounded-pill bg-white/90 text-marron shadow-soft hover:bg-white transition-colors"
              >
                PEDIR +
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
