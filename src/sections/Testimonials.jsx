import { testimonials } from '../data/testimonials'

export default function Testimonials() {
  return (
    <section className="py-14">
      <div className="section">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl">Testimonios</h2>
          <p className="mt-2 text-marron/80">Lo que dicen nuestros clientes</p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article key={t.id} className="bg-white rounded-card-lg shadow-soft p-6">
              <div className="flex gap-1" role="img" aria-label={t.rating + ' de 5 estrellas'}>
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} aria-hidden="true" className="text-fresa">★</span>
                ))}
              </div>
              <p className="mt-3 text-marron/80">"{t.text}"</p>
              <div className="mt-4 font-semibold">{t.name}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
