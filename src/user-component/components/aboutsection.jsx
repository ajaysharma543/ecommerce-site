import React from 'react'
import { Link } from 'react-router-dom'

function Aboutsection() {
  return (
   <>
      <section className="my-10 mx-4 md:mx-15">
        <div className="aboutcontainer flex flex-col md:flex-row justify-start items-center">
          <img
            src="https://plus.unsplash.com/premium_photo-1661964205360-b0621b5a9366?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHwwfDB8fHww"
            alt="About Us"
            className="rounded-lg shadow-md mt-6 w-full md:w-1/2 h-64 md:h-110 object-cover"
          />
          <section className="max-w-3xl my-10 mx-4 md:mx-15">
            <h2 className="text-4xl text-white font-semibold my-5">Who We Are</h2>
            <div className="border-t border-[#b79141] max-w-2xs w-[150px] py-3"></div>
            <p className="text-white mt-2 text-lg">
              Welcome to Coding With Yash, where innovation meets excellence! 🚀
              We are a team of passionate professionals dedicated to delivering
              cutting-edge solutions that empower businesses and individuals.
              Our journey began with a simple vision: to bridge the gap between
              technology and people by offering high-quality digital solutions.
              Over the years, we have worked with numerous clients, helping them
              turn their ideas into reality. Whether it's web development,
              e-commerce solutions, or custom software, we strive to deliver
              exceptional results with creativity and precision.
            </p>
            <p className="text-white mt-10 mb-5 text-lg">
              At Coding With Yash, we believe that technology should be
              accessible, user-friendly, and impactful. Our commitment to
              excellence, innovation, and customer satisfaction sets us apart.
              With a strong focus on quality and long-term success, we ensure
              that every project we undertake exceeds expectations. Join us on
              this exciting journey and let’s create something extraordinary
              together!
            </p>
            <Link
              to="/userlogin/shop"
              className="bg-[#b79141] text-lg text-white px-4 py-2 hover:bg-[#d0bb74] transition-colors"
            >
              View Our Featured Section
            </Link>
          </section>
        </div>
      </section>
    </>
  )
}

export default Aboutsection