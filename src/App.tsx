import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Featured from './sections/Featured'
import Benefits from './sections/Benefits'
import Catalog from './sections/Catalog'
import Gallery from './sections/Gallery'
import Order from './sections/Order'
import About from './sections/About'
import Testimonials from './sections/Testimonials'
import FAQ from './sections/FAQ'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-crema">
        <Navbar />
        <main>
          <Hero />
          <Featured />
          <Benefits />
          <Catalog />
          <Gallery />
          <Order />
          <About />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}

export default App
