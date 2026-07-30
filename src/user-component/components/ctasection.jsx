import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Mail, Phone, MapPin } from "lucide-react"; 
import authservice from "../../appwrite/auth";

const CtaSection = () => {
      const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authservice.getCurrentUser();
        const dbUser = await authservice.getUserDataByEmail(user.email);
        if (dbUser) setUserData(dbUser);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <>
      <h1 className="text-5xl font-bold text-white  mb-6 text-center tracking-wider pt-20">
        Get In Touch With Us
      </h1>
      <div className="border-t border-[#b79141] max-w-3xs m-auto flex items-center py-5 px-3"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-5 ">
        <div className="flex flex-col items-center text-center p-6 bg-white shadow-md">
          <Mail className="text-[#b79141] mb-4" size={30} />
          <h3 className="text-lg font-semibold text-[#2D3748] mb-2">Email</h3>
          <p className="text-[#4A5568]">
            <a
              href="mailto:support@eshop.com"
              className="hover:text-[#1E3A8A] transition-colors"
            >
             {userData ? (
           <>
      <span>{userData.email}</span>
        </>
        )
        : (
          <span>loading</span>
        )
       
        }
            </a>
          </p>
        </div>

        {/* Phone Numbers Column */}
        <div className="flex flex-col items-center text-center p-6 bg-white  shadow-md">
          <Phone className="text-[#b79141] mb-4" size={30} />
          <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
            Phone Numbers
          </h3>
          <p className="text-[#4A5568]">
            <a
              href="tel:+11234567890"
              className="hover:text-[#1E3A8A] transition-colors"
            >
               {userData ? (
           <>
       <span>{userData.number}</span>
        </>
        )
        : (
          <span>loading</span>
        )
       
        }
            </a>
          </p>
          <p className="text-[#4A5568] mt-1">
            <a
              href="tel:+10987654321"
              className="hover:text-[#1E3A8A] transition-colors"
            >
              {userData ? (
           <>
       <span>{userData.number}</span>
        </>
        )
        : (
          <span>loading</span>
        )
       
        }
            </a>
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white shadow-md">
          <MapPin className="text-[#b79141] mb-4" size={30} />
          <h3 className="text-lg font-semibold text-[#2D3748] mb-2">Address</h3>
          <p className="text-[#4A5568]">
            123 E-Shop Street, <br />
            Suite 456, <br />
            New York, NY 10001
          </p>
        </div>
      </div>
      <section className="py-24 px-6 bg-[#b79141] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-4xl font-medium tracking-tight mb-6">
            Ready to embrace minimalism?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-2xl">
            Discover our collection of thoughtfully designed products that bring
            simplicity and elegance to your everyday life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/userlogin/shop"
              className="bg-white text-black px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1 inline-flex items-center justify-center"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/userlogin/contact"
              className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10 inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default CtaSection;
