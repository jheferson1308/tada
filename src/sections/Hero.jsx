import { images } from '../data/images'

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('producto')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToOrder = () => {
    document.getElementById('hacer-pedido')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="inicio" className="pt-28 md:pt-36 pb-12">
      <div className="section grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            POSTRES SALUDABLES
          </h1>
          <p className="mt-4 text-lg md:text-xl tracking-wide uppercase">
            DULCE PLACER Y BIENESTAR EN CADA BOCADO
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-pill bg-durazno text-sm tracking-widest uppercase">CALIDAD</span>
            <span className="px-4 py-2 rounded-pill bg-durazno text-sm tracking-widest uppercase">INGREDIENTES PREMIUM</span>
            <span className="px-4 py-2 rounded-pill bg-durazno text-sm tracking-widest uppercase">VERSÁTIL</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={scrollToCatalog}
              className="px-6 py-3 rounded-pill bg-marron text-white shadow-soft hover:shadow-hover transition-shadow"
            >
              VER CATÁLOGO
            </button>
            <button
              onClick={scrollToOrder}
              className="px-6 py-3 rounded-pill bg-fresa text-white shadow-soft hover:shadow-hover transition-shadow"
            >
              HACER PEDIDO
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-durazno/60 to-crema rounded-[40px] -z-10"></div>
          <img
            src={images.quequeZanahoria}
            alt="Queque de zanahoria de Tadá Repostería"
            className="w-full h-[420px] md:h-[520px] object-cover rounded-[40px] shadow-soft"
          />
        </div>
      </div>
    </section>
  )
}
