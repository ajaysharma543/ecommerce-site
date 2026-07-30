import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

function Featuredproduct() {
  const [products, setProducts] = useState([]);

  const featuredCategories = ['Shoes', 'men', 'women', 'jewellary'];

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = [];

      for (let category of featuredCategories) {
        const response = await service.getitemPosts([
          Query.equal('category', category),
          Query.limit(2),
        ]);
        if (response) {
          allProducts.push(...response.documents)
        }
      }

      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-14">
      <h2 className="text-5xl text-white font-bold mb-6 text-center tracking-wider">
        Our Featured Products
      </h2>
      <div className="border-t border-[#b79141] max-w-3xs m-auto flex items-center py-5"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((post) => (
          <div
            key={post.$id}
            className="w-[97%] flex flex-col bg-white border shadow-sm hover:shadow-md transition-shadow duration-200 p-2"
          >
            <div className="w-full h-48 overflow-hidden rounded-md mb-4 cursor-pointer">
              <img
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
                alt={post.itemtitle}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate cursor-pointer hover:text-pink-500 transition-colors">
              {post.itemtitle}
            </h3>

            <p className="text-sm text-gray-500 mb-4 line-clamp-2 italic">
              {post.description}
            </p>

            <div className="flex justify-between items-center text-base font-medium text-green-600">
              <p>
                ₹{post.price}
                {post.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{(post.price / (1 - post.discount / 100)).toFixed(0)}
                  </span>
                )}
              </p>

              <Link
                to={`/userlogin/product/${post.$id}`}
                className="bg-[#b79141] text-white px-4 py-2 hover:bg-[#d0bb74] transition-colors"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featuredproduct;
