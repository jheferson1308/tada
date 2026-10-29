import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { config } from '../config'
import { images } from '../data/images'
import { zones } from '../data/zones'
import { useCart } from '../context/CartContext'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const inputClass =
  'w-full px-4 py-3 rounded-card border border-durazno outline-none focus:ring-2 focus:ring-fresa/40'

const ICA_CENTER = { lat: -14.0678, lng: -75.7286 }
const GEO_PERMISSION_DENIED = 1
const GEO_POSITION_UNAVAILABLE = 2
const GEO_TIMEOUT = 3

const mapsUrlFor = (coords) => 'https://www.google.com/maps?q=' + coords.lat + ',' + coords.lng

const formatDate = (value) => {
  if (!value) return ''
  const [date, time] = value.split('T')
  const [year, month, day] = date.split('-')
  return day + '/' + month + '/' + year + ' ' + time
}

export default function Order() {
  const { items, total } = useCart()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [orderError, setOrderError] = useState('')
  const [success, setSuccess] = useState('')
  const [coords, setCoords] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const recenterRef = useRef(true)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    zone: zones[0],
    address: '',
    date: '',
    notes: '',
  })

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  useEffect(() => {
    setSuccess('')
    setOrderError('')
  }, [items])

  const totalUnits = items.reduce((sum, item) => sum + item.qty, 0)

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
    setSuccess('')
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const useCurrentLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no permite obtener la ubicación.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        recenterRef.current = true
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setErrors((prev) => ({ ...prev, address: undefined }))
        setLocating(false)
      },
      (error) => {
        let message = 'No pudimos obtener tu ubicación. Inténtalo de nuevo.'
        if (error.code === GEO_PERMISSION_DENIED) {
          message = 'Permiso denegado. Habilita la ubicación en tu navegador para continuar.'
        } else if (error.code === GEO_TIMEOUT) {
          message = 'Se agotó el tiempo para obtener tu ubicación. Inténtalo de nuevo.'
        } else if (error.code === GEO_POSITION_UNAVAILABLE) {
          message = 'Tu ubicación no está disponible en este momento.'
        }
        setLocationError(message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  const toggleMap = () => {
    setLocationError('')
    setShowMap((prev) => !prev)
  }

  const openLocationMap = () => {
    if (!coords) return
    window.open(mapsUrlFor(coords), '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapRef.current) return
    const map = L.map(mapContainerRef.current, {
      center: [ICA_CENTER.lat, ICA_CENTER.lng],
      zoom: 15,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)
    map.on('click', (event) => {
      recenterRef.current = false
      setCoords({ lat: event.latlng.lat, lng: event.latlng.lng })
    })
    mapRef.current = map
    recenterRef.current = true
    const timer = setTimeout(() => map.invalidateSize(), 0)
    return () => {
      clearTimeout(timer)
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [showMap])

  useEffect(() => {
    if (showMap && mapRef.current) {
      const timer = setTimeout(() => mapRef.current?.invalidateSize(), 0)
      return () => clearTimeout(timer)
    }
  }, [showMap, coords])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!coords) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }
    const latlng = [coords.lat, coords.lng]
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng)
    } else {
      const marker = L.marker(latlng, { draggable: true }).addTo(map)
      marker.on('dragend', () => {
        const position = marker.getLatLng()
        recenterRef.current = false
        setCoords({ lat: position.lat, lng: position.lng })
      })
      markerRef.current = marker
    }
    if (recenterRef.current) {
      map.setView(latlng, 17)
      recenterRef.current = false
    }
  }, [coords, showMap])

  useEffect(() => {
    if (!coords) return
    setForm((prev) => ({
      ...prev,
      address: 'Ubicación GPS (' + coords.lat.toFixed(5) + ', ' + coords.lng.toFixed(5) + ')',
    }))
  }, [coords])

  const validateStep1 = () => {
    const next = {}
    const digits = form.phone.replace(/\D/g, '')
    if (form.name.trim().length < 3) next.name = 'Ingresa tu nombre completo.'
    if (digits.length < 6 || digits.length > 15) next.phone = 'Ingresa un teléfono válido.'
    if (form.address.trim().length < 5) next.address = 'Ingresa tu dirección de entrega.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goToStep2 = (event) => {
    event.preventDefault()
    if (validateStep1()) {
      setOrderError('')
      setShowMap(false)
      setStep(2)
    }
  }

  const buildWhatsAppUrl = () => {
    const details = [
      ['Nombre', form.name],
      ['Teléfono', form.phone],
      ['Zona', form.zone],
      ['Dirección', form.address],
      ['Ubicación', coords ? mapsUrlFor(coords) : ''],
      ['Fecha/Hora', formatDate(form.date)],
      ['Notas', form.notes],
    ]
      .filter(([, value]) => value && value.trim())
      .map(([label, value]) => label + ': ' + value.trim())

    const lines = items.map(
      (item) => '- ' + item.name + ' x' + item.qty + ' = S/ ' + (item.price * item.qty).toFixed(2)
    )

    const messageParts = [
      'Hola! Quiero hacer un pedido en ' + config.businessName + ':',
      ...details,
      '',
      'Pedido:',
      ...lines,
      'Total: S/ ' + total.toFixed(2),
      'Pago: Yape ' + config.payment.yape + ' / Plin ' + config.payment.plin,
      '',
      config.anticipation,
    ]

    return 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(messageParts.join('\n'))
  }

  const send = (event) => {
    event.preventDefault()
    if (!validateStep1()) {
      setStep(1)
      return
    }
    if (items.length === 0) {
      setOrderError('Agrega productos al carrito antes de enviar el pedido.')
      return
    }
    if (form.date && form.date < minDate) {
      setErrors((prev) => ({
        ...prev,
        date: 'Elige una fecha con al menos 24 horas de anticipación.',
      }))
      return
    }

    setOrderError('')
    const url = buildWhatsAppUrl()
    const popup = window.open(url, '_blank')
    if (!popup) {
      window.location.href = url
      return
    }
    setSuccess('Pedido listo. Revisa WhatsApp y envía el mensaje para confirmar tu pedido.')
  }

  return (
    <section id="hacer-pedido" className="py-14">
      <div className="section">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl">Haz tu pedido</h2>
          <p className="mt-2 text-marron/80">Rápido y fácil por WhatsApp</p>
        </div>
        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-card-lg shadow-soft overflow-hidden">
            <img
              src={images.order}
              alt="Cómo pedir"
              loading="lazy"
              decoding="async"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl">Cómo pedir</h3>
              <ol className="mt-4 space-y-3">
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-durazno flex items-center justify-center">1</span>
                  <span>Elige tus postres en el catálogo</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-durazno flex items-center justify-center">2</span>
                  <span>Completa tus datos y zona de delivery</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-durazno flex items-center justify-center">3</span>
                  <span>Confirma y envía por WhatsApp</span>
                </li>
              </ol>
              <div className="mt-6 p-4 rounded-card bg-durazno/60">
                <div className="font-semibold">Horarios</div>
                <div className="text-sm mt-1">{config.hours}</div>
                <div className="font-semibold mt-3">Zona de delivery</div>
                <div className="text-sm mt-1">Ica y alrededores</div>
                <div className="font-semibold mt-3">Métodos de pago</div>
                <div className="text-sm mt-1">
                  Yape: {config.payment.yape} · Plin: {config.payment.plin}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-card-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Formulario</h3>
              <div className="text-sm text-marron/70">Paso {step} de 2</div>
            </div>

            {items.length === 0 && (
              <div className="mt-4 p-4 rounded-card bg-durazno/60 text-sm">
                Tu carrito está vacío.{' '}
                <button
                  type="button"
                  onClick={() => document.getElementById('producto')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-semibold underline"
                >
                  Ver catálogo
                </button>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={goToStep2} noValidate className="mt-4 space-y-3">
                <div>
                  <label htmlFor="customer-name" className="sr-only">
                    Nombre completo
                  </label>
                  <input
                    id="customer-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={updateField('name')}
                    placeholder="Nombre completo"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'customer-name-error' : undefined}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p id="customer-name-error" role="alert" className="mt-1 text-sm text-fresa">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="customer-phone" className="sr-only">
                    Teléfono o WhatsApp
                  </label>
                  <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={updateField('phone')}
                    placeholder="Teléfono / WhatsApp"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'customer-phone-error' : undefined}
                    className={inputClass}
                  />
                  {errors.phone && (
                    <p id="customer-phone-error" role="alert" className="mt-1 text-sm text-fresa">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <select
                  name="zone"
                  value={form.zone}
                  onChange={updateField('zone')}
                  aria-label="Zona de delivery"
                  className={inputClass}
                >
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
                <div>
                  <label htmlFor="customer-address" className="sr-only">
                    Dirección de entrega
                  </label>
                  <input
                    id="customer-address"
                    name="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={updateField('address')}
                    placeholder="Dirección de entrega"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? 'customer-address-error' : undefined}
                    className={inputClass}
                  />
                  {errors.address && (
                    <p id="customer-address-error" role="alert" className="mt-1 text-sm text-fresa">
                      {errors.address}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      disabled={locating}
                      className="px-3 py-2 rounded-pill bg-durazno shadow-soft hover:shadow-hover transition-shadow disabled:opacity-60"
                    >
                      {locating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMap}
                      className="px-3 py-2 rounded-pill bg-crema shadow-soft hover:shadow-hover transition-shadow"
                    >
                      {showMap ? 'Ocultar mapa' : 'Ver en el mapa'}
                    </button>
                  </div>
                  {showMap && (
                    <div
                      ref={mapContainerRef}
                      className="mt-3 h-56 w-full rounded-card overflow-hidden"
                      aria-label="Mapa para seleccionar la ubicación de entrega"
                    />
                  )}
                  {coords && (
                    <button
                      type="button"
                      onClick={openLocationMap}
                      className="mt-2 text-sm underline hover:text-marron"
                    >
                      Ver ubicación seleccionada en el mapa
                    </button>
                  )}
                  {locationError && (
                    <p role="alert" className="mt-1 text-sm text-fresa">
                      {locationError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-pill bg-marron text-white shadow-soft hover:shadow-hover transition-shadow"
                >
                  CONTINUAR
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={send} noValidate className="mt-4 space-y-3">
                <div>
                  <label htmlFor="delivery-date" className="text-sm text-marron/70">
                    Fecha y hora preferidas
                  </label>
                  <input
                    id="delivery-date"
                    name="date"
                    type="datetime-local"
                    min={minDate}
                    value={form.date}
                    onChange={updateField('date')}
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? 'delivery-date-error' : undefined}
                    className={inputClass + ' mt-1'}
                  />
                  {errors.date && (
                    <p id="delivery-date-error" role="alert" className="mt-1 text-sm text-fresa">
                      {errors.date}
                    </p>
                  )}
                </div>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="Notas / instrucciones"
                  aria-label="Notas o instrucciones"
                  rows={4}
                  className={inputClass}
                />
                <div className="p-4 rounded-card bg-durazno/60 text-sm">
                  <div className="font-semibold">Resumen</div>
                  <div className="mt-1">
                    Productos: {totalUnits} | Total: S/ {total.toFixed(2)}
                  </div>
                  <div className="mt-1">
                    Dirección: {form.address}
                    {coords ? ' · Ubicación GPS adjunta al mensaje' : ''}
                  </div>
                  <div className="mt-1">{config.anticipation}</div>
                  <div className="mt-1">
                    Pago por Yape ({config.payment.yape}) o Plin ({config.payment.plin})
                  </div>
                </div>
                {orderError && (
                  <p role="alert" className="text-sm text-fresa">
                    {orderError}
                  </p>
                )}
                {success && (
                  <p className="p-3 rounded-card bg-salvia/20 text-sm" role="status">
                    {success}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-pill bg-durazno shadow-soft"
                  >
                    ATRÁS
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-pill bg-fresa text-white shadow-soft hover:shadow-hover transition-shadow"
                  >
                    ENVIAR POR WHATSAPP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
