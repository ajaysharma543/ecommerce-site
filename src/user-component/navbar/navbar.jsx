import React from 'react'
import { Instagram, Facebook, Linkedin, Menu, X } from "lucide-react";
import { Link, NavLink, Outlet } from 'react-router-dom';
function Userlogin() {
  return (
    <>
    <header className="bg-[#000] w-full shadow-md z-50">
      {/* Top Bar */}
      <div className="text-white text-sm py-3">
        <div className="flex justify-between items-center px-10 py-2 border-b border-[#b79141]">
          <div className="flex items-center space-x-4 text-xl">
            <span>+00 123 456 789</span>
            <span>Email: info@gmail.com</span>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
               <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
             <Facebook size={18} />

            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
          <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

         <nav className="px-10 py-5 shadow text-[#fff] flex justify-between items-center">
        <div className="container">
          <Link className="text-2xl font-semibold uppercase space-x-6 text-[#f0ebd1]/70" to="/">
            Coding With Ajay
          </Link>
        </div>

        <div className="hidden md:flex container justify-end space-x-6 text-lg items-center">
         <NavLink
  to="/userlogin/home"
  className={({ isActive }) =>
    isActive ? "text-[#b79141] font-semibold transition-colors" : "hover:text-[#b79141] transition-colors"
  }
>
  Home
</NavLink>
        <NavLink to="/userlogin/about" className={({ isActive }) => isActive ? "text-[#b79141] font-semibold transition-colors" : "hover:text-[#b79141] transition-colors"}>
  About Us
</NavLink>

<NavLink to="/userlogin/shop" className={({ isActive }) => isActive ? "text-[#b79141] font-semibold transition-colors" : "hover:text-[#b79141] transition-colors"}>
  Shop
</NavLink>

<NavLink to="/userlogin/contact" className={({ isActive }) => isActive ? "text-[#b79141] font-semibold transition-colors" : "hover:text-[#b79141] transition-colors"}>
  Contact
</NavLink>

<NavLink to="/userlogin/cart" className={({ isActive }) => isActive ? "text-[#b79141] font-semibold transition-colors" : "hover:text-[#b79141] transition-colors"}>
  Cart
</NavLink>

          <button className="bg-[#b79141] text-white px-4 py-2 rounded-md hover:bg-[#a17d36] transition-colors">
            Call Now
          </button>
        </div>
      </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Userlogin