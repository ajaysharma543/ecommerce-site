import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';

function Addsub() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null); 
  
  useEffect(() => {
    service.getPosts([]).then((response) => {
      if (response) {
        setCategories(response.documents);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    try {
      await service.createSubCategory(category, subcategory, description, file);

      // Reset form
      setCategory('');
      setSubCategory('');
      setDescription('');
      setFile(null);
      e.target.reset(); // Reset file input field

    } catch (err) {
      console.error("Error adding sub-category:", err);
      alert("Error uploading sub-category");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">Add Sub-Category</h2>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.$id} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Category Name */}
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Sub-Category Name</label>
        <input
          type="text"
          id="subcategory"
          value={subcategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter Sub-Category Name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter description"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        Submit
      </button>
    </form>
  );
}

export default Addsub;
