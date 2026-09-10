import Divider from '../Components/Divider'
import FAQ from '../Components/FAQ'
import Footer from '../Components/Footer'
import Hero from '../Pages/Hero'
import MissionVision from '../Components/MissionVision'
import Navbar from '../Components/Navbar'
import Products from '../Components/Products-card'

function Home() {

  return (
     <>

      <Navbar />
      <Hero />
      <Divider />
      <Products />
      <MissionVision />
      <Divider />
      <FAQ />
      <Footer />

     </>
  )
}

export default Home