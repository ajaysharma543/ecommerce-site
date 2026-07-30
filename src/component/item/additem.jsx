import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';

function Additem() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    service.getPosts([]).then((response) => {
      if (response) {
        setCategories(response.documents);
      }
    });

    service.getsubPosts([]).then((response) => {
      if (response) {
        setSubcategories(response.documents);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await service.createItem(
        itemTitle,
        category,
        image,
        parseInt(quantity),
        parseFloat(price),
        description,
        parseFloat(discount),
        selectedSubcategory, 

      );
      setCategory('');
      setSelectedSubcategory('');
      setItemTitle('');
      setDescription('');
      setPrice('');
      setDiscount('');
      setQuantity('');
      setImage(null);
      document.getElementById("file").value = '';
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Failed to add item.");
    }
  };

  const filterproducts = subcategories.filter((item) => {
   return item.category === category
  })

  return (
    <div className="max-w-2xl mx-auto p-5 bg-white rounded-3xl shadow-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-8 text-gradient bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Add Item
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 cursor-pointer rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.$id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Sub-category</label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full p-3 cursor-pointer rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          >
            <option value="">Select a sub-category</option>
            {filterproducts.map((sub) => (
              <option key={sub.$id} value={sub.subcategory}>
                {sub.subcategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Item Title</label>
          <input
            type="text"
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            placeholder="Enter item title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            placeholder="Enter description"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Discount</label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            placeholder="Enter discount"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            id="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-3 cursor-pointer rounded-xl border-2 border-gray-300 bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-pink-500 file:text-white hover:file:bg-pink-600 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default Additem;
