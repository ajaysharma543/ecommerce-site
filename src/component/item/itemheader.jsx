import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Itemheader() {
  const navLinkStyles = ({ isActive }) =>
    `text-lg font-medium transition px-4 py-2 rounded-md ${
      isActive
        ? 'bg-yellow-400 text-black'
        : 'text-gray-100 hover:bg-gray-700 hover:text-yellow-300'
    }`;

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-md py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-white text-3xl font-bold">Shop Categories</h1>

          <nav className="flex flex-wrap gap-3">
         <NavLink to="/items/home" end className={navLinkStyles}>
  Home
</NavLink>
<NavLink to="/items/men" className={navLinkStyles}>
  Men
</NavLink>
<NavLink to="/items/women" className={navLinkStyles}>
  Women
</NavLink>
<NavLink to="/items/shoes" className={navLinkStyles}>
  Shoes
</NavLink>
<NavLink to="/items/jewellary" className={navLinkStyles}>
  Jewellery
</NavLink>

          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 text-white">
        <Outlet />
      </main>
    </>
  );
}

export default Itemheader;
