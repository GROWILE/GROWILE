import Divider from '../../../../packages/ui/src/Divider'
import FAQ from '../../../../packages/ui/src/FAQ'
import Footer from '../../../../packages/ui/src/Footer'
import Hero from '../../../../packages/ui/src/Hero'
import MissionVision from '../Components/MissionVision'
import Navbar from '../../../../packages/ui/src/Navbar'
import Products from '../../../../packages/ui/src/Products-card'
import webLogo from '../../../../packages/ui/assets/growile-logo.svg'
import OrganizationSchema from '../../../../packages/ui/src/OrganizationSchema'
import WebsiteSchema from '../../../../packages/ui/src/WebsiteSchema'


const mainFaqs = [
    { question: "Do I need to create an account to use Growile tools?", answer: "No. There is no sign-up, login, or registration required. You can access and use all our tools instantly for free." },
    { question: "Are my documents and data secure?", answer: "Yes, 100% secure. We never store your data on our servers. Everything processes locally right inside your web browser." },
    { question: "Are Growile tools completely free to use?", answer: "Yes, our tools are free. A small, clean brand watermark helps us keep the platform open and free for everyone worldwide." },
    { question: "Can I use Growile tools for international clients?", answer: "Yes! Our platform supports multi-currency options and global standards, making it ideal for cross-border workflows." },
    { question: "Is there any usage limit on the tools?", answer: "No limits at all. You can generate, create, and download as many professional files as your business needs." },
    { question: "What tools are currently available on Growile?", answer: "We currently offer a powerful Free Invoice Generator (GST & Non-GST), with more productivity tools launching soon." }
  ];

  const mainFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

function Home() {

  return (

    <>
      <OrganizationSchema />
      <WebsiteSchema />

      <Navbar
        logoAlt="Growile"
        logoSrc={webLogo}
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "PDF", href: "/pdf" },
            { label: "Invoice", href: "/invoice" },
          ],
        }}
        about={{ label: "About", href: "/about" }}
      />
      <Hero
        title= "Web tools for the modern global workflow."
        subtitle="Built for freelancers, creators, and teams who move fast. Growile combines zero-signup accessibility with cross-border flexibility. Generate, create, and manage your work securely in your browser without ever compromising on privacy."
        ctaText="Explore Products"
        ctaHref="/products"
      />
      <Divider />
      <Products />
      <MissionVision />
      <Divider />
      <FAQ
        heading="Frequently Asked Questions"
        faqs={mainFaqs}
      />

      {/* Google-kku Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainFaqSchema) }}
       />
  
      <Footer termsHref="/terms-of-service"/>

        
     </>

  );
}

export default Home