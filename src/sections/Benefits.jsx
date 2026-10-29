const benefits = [
  { title: 'Ingredientes naturales', icon: '🌿' },
  { title: 'Bajo en azúcar', icon: '🍯' },
  { title: 'Hecho al día', icon: '⏱️' },
  { title: 'Delivery en Ica y alrededores', icon: '🚚' },
]

export default function Benefits() {
  return (
    <section className="py-10">
      <div className="section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-2 p-5 rounded-card bg-white shadow-soft"
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="text-sm tracking-wide uppercase">{b.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
