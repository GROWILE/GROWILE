import Divider from '../../../../packages/ui/src/Divider'
import FAQ from '../../../../packages/ui/src/FAQ'
import Footer from '../../../../packages/ui/src/Footer'
import Hero from '../../../../packages/ui/src/Hero'
import MissionVision from '../Components/MissionVision'
import Navbar from '../../../../packages/ui/src/Navbar'
import Products from '../../../../packages/ui/src/Products-card'
import webLogo from '../../../../packages/ui/assets/growile-invoice-logo.svg'


function Home() {

  return (

    <>

      <Navbar
        logoAlt="Growile"
        logoSrc={webLogo}
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "Finance", href: "/finance" },
            { label: "Invoice", href: "/invoice" },
          ],
        }}
        about={{ label: "About", href: "/about" }}
      />
      <Hero
        title="Digital Innovation, Built for Tomorrow"
        subtitle="We create modern software solutions that combine thoughtful design, powerful technology, and scalable architecture to help businesses move faster, work smarter, and stay ready for what's next."
        ctaText="Explore Products"
        ctaHref="/products"
      />
      <Divider />
      <Products />
      <MissionVision />
      <Divider />
      <FAQ
        heading="Frequently Asked Questions"
        faqs={[
          { question: "Who are you and what do you do?", answer: "We're a software company building simple, browser-based tools that help people handle everyday digital tasks — without the clutter, cost, or complexity most software comes with." },
          { question: "Why did you start this company?", answer: "We saw people paying for bloated software full of features they never use, so we set out to build simple tools that just work." },
          { question: "Are you a new company?", answer: "Yes, we're a newly founded company — but our tools are already live and being actively improved." },
          { question: "Do I need to create an account to use your products?", answer: "No, most of our tools work without an account. Signing up just lets you save your history and preferences." },
         ]}
       />
      <Footer termsHref="/terms-of-service" />
        {/* <Footer*/}
     </>

  );
}

export default Home