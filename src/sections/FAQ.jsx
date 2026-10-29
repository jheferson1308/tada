import { faq } from '../data/faq'
import { useState } from 'react'

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-14">
      <div className="section max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl">Preguntas frecuentes</h2>
        </div>
        <div className="mt-8 space-y-3">
          {faq.map((item, idx) => (
            <div key={idx} className="bg-white rounded-card shadow-soft overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                aria-controls={'faq-answer-' + idx}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold">{item.q}</span>
                <span aria-hidden="true" className="text-xl">{open === idx ? '-' : '+'}</span>
              </button>
              {open === idx && (
                <div id={'faq-answer-' + idx} className="px-5 pb-5 text-marron/80">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
