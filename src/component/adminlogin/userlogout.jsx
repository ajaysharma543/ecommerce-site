import { Outlet, NavLink, Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import authservice from "../../appwrite/auth";

const UserLayout = ({ Logouthandler }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authservice.getCurrentUser();
        const dbUser = await authservice.getUserDataByEmail(user.email);
        if (dbUser) setUser(dbUser);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <>
      {/* Top Info Bar */}
      <header className="bg-black w-full shadow-md z-50">
        <div className="text-white text-sm py-3 border-b border-[#b79141] flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 gap-2 sm:gap-0">
          <div className="flex items-center space-x-4 text-xl">
            {user ? (
              <>
                <span>{user.number}</span>
                <span>{user.email}</span>
              </>
            ) : (
              <span>Loading...</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b79141] transition-colors duration-200 cursor-pointer"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b79141] transition-colors duration-200 cursor-pointer"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b79141] transition-colors duration-200 cursor-pointer"
            >
              <Linkedin size={22} />
            </a>
            <button
              onClick={Logouthandler}
              className="bg-[#b79141] hover:bg-[#a17d36] text-white font-semibold px-4 py-1.5 text-sm rounded-md transition duration-200 shadow-md cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navbar */}
        <nav className="px-4 sm:px-10 py-5 shadow text-white flex justify-between items-center">
          <div>
            <Link
              to="/"
              className="text-2xl font-semibold uppercase text-[#f0ebd1]/70"
            >
              {user ? (
                <>
                  Coding With <span>{user.name}</span>
                </>
              ) : (
                <span>Loading...</span>
              )}
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 text-lg items-center">
            <NavLink
              to="/userlogin/home"
              className={({ isActive }) =>
                isActive
                  ? "text-[#b79141] font-semibold"
                  : "hover:text-[#b79141] cursor-pointer"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/userlogin/about"
              className={({ isActive }) =>
                isActive
                  ? "text-[#b79141] font-semibold"
                  : "hover:text-[#b79141] cursor-pointer"
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/userlogin/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-[#b79141] font-semibold"
                  : "hover:text-[#b79141] cursor-pointer"
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/userlogin/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-[#b79141] font-semibold"
                  : "hover:text-[#b79141] cursor-pointer"
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/userlogin/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-[#b79141] font-semibold"
                  : "hover:text-[#b79141] cursor-pointer"
              }
            >
              Cart
            </NavLink>
           <NavLink
            to="/userlogin/order"
            className={({ isActive }) =>
              isActive
                ? "text-[#b79141] font-semibold flex items-center space-x-1"
                : "hover:text-[#b79141] cursor-pointer flex items-center space-x-1"
            }
          >
            <ShoppingBag size={18} className="cursor-pointer" />
            <span>Orders</span>
          </NavLink>

          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
