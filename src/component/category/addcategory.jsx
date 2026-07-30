import React, { useState } from 'react';
import service from '../../appwrite/config';

function AddCategory() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  try {
    await service.createCategory(category, description, file);

    alert("Category added successfully!");
    setCategory('');
    setDescription('');
    setFile(null);
    document.getElementById("file").value = '';
  } catch (err) {
    console.error("Error adding category:", err);
    alert("Error uploading category");
  }
};



  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">Add Category</h2>

      <div>
        <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Category Name</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter category name"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter description"
          required
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-gray-700 font-medium mb-1">Upload File</label>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
      >
        Submit
      </button>
    </form>
  );
}

export default AddCategory;
