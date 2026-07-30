import React from 'react';
import { useNavigate } from 'react-router-dom';

function Add() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const cards = [
    { title: "Category", path: "/category" },
    { title: "Item", path: "/item" },
    { title: "Sub-category", path: "/subcategory" },
    { title: "User-details", path: "/details" },
    { title: "Order-details", path: "/order" },
  ];

  return (
    <div className='flex flex-col w-full'>
      <main className="flex gap-8 pt-10 px-10 flex-wrap justify-start items-start min-h-[calc(100vh-80px)] bg-black">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => handleNavigation(card.path)}
            className="bg-white h-[auto] w-[auto] rounded-3xl shadow-xl p-6 flex items-center justify-center 
                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br 
                       hover:from-white hover:via-pink-100 hover:to-purple-100 cursor-pointer"
          >
            <h1 className="text-2xl font-extrabold text-black  bg-clip-text bg-white shadow-orange-50 tracking-widest">
              {card.title}
            </h1>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Add;
