import React, { useEffect, useState } from 'react';
import Pagebanner from '../components/pagebanner';
import service from '../../appwrite/config';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

function Shop() {
  const [posts, setPosts] = useState([]);
const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(10000);
const [sortbyname , setsortbyname] = useState("");
const [selectedCategory, setSelectedCategory] = useState('');
const [categories, setCategories] = useState([]);
const [selectedsubCategory, setSelectedsubCategory] = useState('');
const [subcategories, setsubCategories] = useState([]);

useEffect(() => {
  const getData = async () => {
    try {
      const response = await service.getitemPosts([Query.limit(100)]);
      const allPosts = response.documents || [];

      const categoryfilters = [...new Set(allPosts.map((item) => item.category))];
      setCategories(categoryfilters);

      const filteredForSub = selectedCategory
        ? allPosts.filter((item) => item.category === selectedCategory)
        : allPosts;

      const subcategoryfilters = [...new Set(filteredForSub.map((item) => item.subcategory))];
      setsubCategories(subcategoryfilters);

      const filtered = allPosts.filter(
        (item) =>
          item.price >= minPrice &&
          item.price <= maxPrice &&
          (selectedCategory === '' || item.category === selectedCategory) &&
          (selectedsubCategory === '' || item.subcategory === selectedsubCategory)
      );

      // Sorting logic
      if (sortbyname === 'asc') {
        filtered.sort((a, b) => a.itemtitle.localeCompare(b.itemtitle));
      } else if (sortbyname === 'desc') {
        filtered.sort((a, b) => b.itemtitle.localeCompare(a.itemtitle));
      }

      setPosts(filtered);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  getData();
}, [minPrice, maxPrice, sortbyname, selectedCategory, selectedsubCategory]);

  return (
    <>
      <Pagebanner title="Shop" breadcrumb="Home / Shop" />
      <div className="flex py-20 px-5 gap-6 bg-black">
        {/* Filter Section */}
        <div className="w-1/4 bg-gray-100 h-[500px] p-4 rounded-lg ">
          <h2 className="text-xl font-bold text-[#4A5568] mb-4">Filters</h2>
           <div className="mb-4">
            <label className="block text-[#4A5568] mb-2">Price Range</label>
            <div className="flex items-center gap-2">
            <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                className="w-1/2 p-2 border rounded text-[#2D3748]"
                placeholder="Min"
              />

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-1/2 p-2 border rounded text-[#2D3748]"
                placeholder="Max"
              />

                </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#4A5568] mb-2">Sort by Name</label>
            <select
          
          value={sortbyname}
          onChange={(e) => setsortbyname(e.target.value)}
              className="w-full p-2 border rounded text-[#2D3748]"
            >
              <option value="">None</option>
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </div>
           <div className="mb-4">
            <label className="block text-[#4A5568] mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded text-[#2D3748]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
           <div className="mb-4">
            <label className="block text-[#4A5568] mb-2">Sub-Category</label>
            <select
              value={selectedsubCategory}
              onChange={(e) => setSelectedsubCategory(e.target.value)}
              className="w-full p-2 border rounded text-[#2D3748]"
            >
              <option value="">All Sub-Categories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Section */}
        <div className="w-3/4">
          <h2 className="text-5xl font-bold mb-3 text-white">
            Our Featured Products
          </h2>
          <p className="mb-6 text-white">
            Browse our curated collection of minimalist designs that combine form and function.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((item) => (
              <div
            key={item.$id}
            className="w-[97%] flex flex-col bg-white border  shadow-sm hover:shadow-md transition-shadow duration-200 p-2"
          >
            <div className="w-[70%] mx-auto h-48 overflow-hidden rounded-md mb-4 cursor-pointer">
              <img
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
                alt={item.itemtitle}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate cursor-pointer hover:text-pink-500 transition-colors">
              {item.itemtitle}
            </h3>

            <p className="text-sm text-gray-500 mb-4 line-clamp-2 italic">
              {item.description}
            </p>

            <div className="text-base font-medium text-green-600">
              ₹{item.price}
              {item.discount > 0 && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{(item.price / (1 - item.discount / 100)).toFixed(0)}
                </span>
              )}
              <Link
              to={`/userlogin/product/${item.$id}`}
              className="bg-[#b79141] float-end text-white px-4 py-2 hover:bg-[#d0bb74] transition-colors"
            >
              View Product
            </Link>

            </div>
          </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
