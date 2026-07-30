import React from 'react'
import Pagebanner from '../components/pagebanner'
import CtaSection from '../components/ctasection'
import ContactForm from '../components/contactform'

function Contact() {
  return (
 <>
   <Pagebanner 
   title="Contact"
   breadcrumb="Home / Contact Us"
   />
   <CtaSection />
   <ContactForm />
 </>
  )
}

export default Contact