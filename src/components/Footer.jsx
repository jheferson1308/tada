import { config } from '../config'

export default function Footer() {
  return (
    <footer className="bg-durazno/60 mt-16">
      <div className="section py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-fraunces text-lg tracking-[0.25em] uppercase">
            {config.businessName}
          </div>
          <p className="mt-3 text-sm text-marron/80">
            Postres saludables en {config.address}. Dulce placer y bienestar en cada bocado.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 rounded-pill bg-crema shadow-soft">
              Yape: {config.payment.yape}
            </span>
            <span className="px-3 py-1 rounded-pill bg-crema shadow-soft">
              Plin: {config.payment.plin}
            </span>
          </div>
        </div>
        <div>
          <div className="font-fraunces uppercase">Contacto</div>
          <ul className="mt-3 space-y-2 text-sm text-marron/80">
            <li>{config.address}</li>
            <li>{config.hours}</li>
            <li>
              <a
                href={'https://wa.me/' + config.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-marron"
              >
                WhatsApp: {config.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-fraunces uppercase">Síguenos</div>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={config.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-pill bg-crema shadow-soft hover:shadow-hover transition-shadow"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-marron/10">
        <div className="section py-4 text-center text-sm text-marron/70">
          © {new Date().getFullYear()} {config.businessName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
