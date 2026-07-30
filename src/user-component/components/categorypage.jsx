import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import service from '../../appwrite/config';
import { Query } from 'appwrite';

function CategoryItems() {
  const { categorySlug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryName = categorySlug.replace(/-/g, ' ');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await service.getitemPosts([
          Query.equal('category', [categoryName]),
          Query.limit(100)
        ]);
        if (res?.documents) {
          setItems(res.documents);
        }
      } catch (err) {
        console.error('Failed to fetch category items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryName]);

  return (
   <div className="p-6 max-w-7xl mx-auto">
  <h2 className="text-3xl font-bold text-center capitalize mb-10 text-white drop-shadow">
    Items in {categoryName}
  </h2>

  {loading ? (
    <div className="text-center text-white text-lg">Loading items...</div>
  ) : items.length === 0 ? (
    <div className="text-center text-white text-lg">No items found.</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <div
          key={item.$id}
          className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
        >
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
            alt={item.itemtitle}
            loading="lazy"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {item.itemtitle}
            </h3>
            <p className="text-lg text-green-700 font-medium mb-1">
              ₹{item.price}
            </p>
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {item.description}
            </p>
          </div>
          <Link
            to={`/userlogin/product/${item.$id}`}
            className="inline-block text-center w-full bg-[#b79141] text-white py-2 rounded-md font-medium hover:bg-[#a58337] transition-colors"
          >
            View Product
          </Link>
        </div>
      ))}
    </div>
  )}
</div>

  );
}

export default CategoryItems;
