import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import { useNavigate, useParams } from 'react-router-dom';

function Seesubcategory() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    service.getsubPosts([]).then((response) => {
      const sub = response.documents.find(doc => doc.$id === id);
      if (sub) {
        setPost(sub);
        setTitle(sub.subcategory);
        setDescription(sub.description);
        setCategory(sub.category);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    const updated = await service.updatesubpost(
      post.$id,
      category,
      title,
      description,
      imageFile // Pass file here
    );

    if (updated) {
      setPost(updated);
      setIsEditing(false);
      setImageFile(null);
    } else {
      alert("Failed to update subcategory.");
    }
  };

  if (loading || !post) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading subcategory details...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start bg-gray-50 px-4 py-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-4 shadow-xl border border-gray-200">

        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition"
          >
            ← Back
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setImageFile(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Subcategory Title */}
        <div className="mb-3">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-pink-600 bg-transparent border-b border-pink-300 focus:outline-none"
            />
          ) : (
            <h3 className="text-2xl font-bold text-pink-600">{post.subcategory}</h3>
          )}
        </div>

        {/* Description */}
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm text-gray-700 bg-transparent border-b border-pink-300 focus:outline-none mb-4"
            rows="3"
          />
        ) : (
          <p className="text-sm text-gray-700 mb-4">{post.description}</p>
        )}

        {/* Current Image Preview */}
        {post.images && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">Current Image:</p>
            <img
          src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
              alt="Subcategory"
              className=" h-32 object-cover rounded-md  w-full"
            />
          </div>
        )}

        {/* Upload New Image */}
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Seesubcategory;
