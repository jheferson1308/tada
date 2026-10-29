import { images } from '../data/images'

const gallery = [
  { src: images.quequeZanahoria, alt: 'Queque de zanahoria' },
  { src: images.mousseFresa, alt: 'Mousse de fresa' },
  { src: images.galletasAvena, alt: 'Galletas de avena' },
  { src: images.brownie, alt: 'Brownie sin gluten' },
  { src: images.cheesecake, alt: 'Cheesecake vegano' },
  { src: images.trufas, alt: 'Trufas de coco y cacao' },
  { src: images.about, alt: 'Preparación artesanal en Tadá Repostería' },
]

export default function Gallery() {
  return (
    <section id="galeria" className="py-14">
      <div className="section">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl">Galería</h2>
          <p className="mt-2 text-marron/80">Nuestros postres en imágenes</p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <figure
              key={item.src}
              className={
                'relative overflow-hidden rounded-card-lg shadow-soft group h-56 md:h-72 ' +
                (index === 0 ? 'col-span-2' : '')
              }
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-marron/80 to-transparent p-2 md:p-4 text-white text-xs md:text-sm leading-tight">
                {item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
