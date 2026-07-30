import React, { useEffect, useState } from 'react';
import { Query } from 'appwrite';
import { Link, useNavigate } from 'react-router-dom';
import service from '../../appwrite/config';

function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await service.getPosts([Query.limit(4)]);
        if (response?.documents) {
          setCategories(response.documents);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        navigate("/userlogin/home");
      }
    };

    loadCategories();
  }, [navigate]);

  return (
    <div className="p-6">
      <h2 className="text-5xl text-white font-bold mb-6 text-center tracking-wider">
        Shop by Category
      </h2>

      <div className="border-t border-[#b79141] max-w-xs mx-auto mb-8"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.$id}
            to={`/userlogin/category/${encodeURIComponent(cat.category.toLowerCase().replace(/\s+/g, '-'))}`}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center group"
          >
            <img
              src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${cat.images}/download?project=6811dfb70032d153aed8`}
              alt={cat.category}
              className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold text-[#2D3748] capitalize">
              {cat.category}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryGrid;
