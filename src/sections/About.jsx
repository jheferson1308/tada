import { config } from '../config'
import { images } from '../data/images'

export default function About() {
  return (
    <section id="acerca-de" className="py-14">
      <div className="section grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl">{config.about.title}</h2>
          <p className="mt-4 text-marron/80 leading-relaxed">{config.about.description}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {config.about.stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-card bg-white shadow-soft">
                <div className="font-fraunces text-2xl">{stat.value}</div>
                <div className="text-sm mt-1 text-marron/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-durazno/60 to-crema rounded-[40px] -z-10"></div>
          <img
            src={images.about}
            alt="Sobre Tadá Repostería"
            loading="lazy"
            decoding="async"
            className="w-full h-[420px] object-cover rounded-[40px] shadow-soft"
          />
        </div>
      </div>
    </section>
  )
}
