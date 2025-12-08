import React from 'react'
import HeroSection from '../components/herosection'
import Categorysection from '../components/categorysection'
import CategoryProductGrid from '../components/featuredproduct'
import CtaSection from '../components/ctasection'
import ContactForm from '../components/contactform'
import Footer from '../components/footer'
import Aboutsection from '../components/aboutsection'

function Home() {
  return (
   <>
    <HeroSection />
    <Aboutsection />
    <Categorysection />
    <CategoryProductGrid />
    <CtaSection />
    <ContactForm />
      <Footer />

   </>
  )
}

export default Home