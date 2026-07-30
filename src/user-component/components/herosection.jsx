import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authservice from "../../appwrite/auth";
const HeroSection = () => {

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
  const backgroundImage =
    "https://images.unsplash.com/photo-1742241107816-349e7f7c0f50?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Replace with your image path

  return (
    <div
      className="relative bg-cover bg-center h-[80vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex items-start flex-col justify-between w-full px-6 md:px-12">
        <h2 className="text-white text-3xl font-bold tracking-widest uppercase">
          This is{" "}
        </h2>
        <h1 className="text-white text-7xl md:text-8xl font-bold opacity-50 tracking-widest uppercase py-5 ">
          {userData ? (
           <>
       Coding With <span>{userData.name}</span>
        </>
        )
        : (
          <span>loading</span>
        )
       
        }
        </h1>
        <Link
          to="/userlogin/shop"
          className="bg-[#b79141] mt-10 text-white px-6 py-3 rounded-md hover:bg-[#C19A2E] transition-colors text-3xl"
        >
          View Products
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
