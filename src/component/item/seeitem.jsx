import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import { useNavigate, useParams } from 'react-router-dom';

function Seeitem() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    service.getitemPost(id).then((response) => {
      if (response) {
        setPost(response);
        setTitle(response.itemtitle);
        setDescription(response.description);
        setPrice(response.price.toString());
        setDiscount(response.discount.toString());
        setQuantity(response.quantity.toString());
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    const updated = await service.updatepost(
          post.$id,
          title,
          description,
          parseInt(quantity),
          parseFloat(price),
          parseFloat(discount),
          imageFile,
          post.images
    );

   if (updated) {
  console.log("Updated post:", updated.images , post.images);
  setPost(updated);
  setIsEditing(false);
  setImageFile(null);
} else {
  alert("Failed to update item.");
}
  };

  if (loading || !post) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading item details...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start bg-gray-50 px-4 py-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-4 shadow-xl border border-gray-200">
        
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

        <div className="relative overflow-hidden rounded-2xl max-h-[40vh] mb-4">
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
            alt={post.category}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Update Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-sm"
            />
          </div>
        )}

        <div className="mb-3">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-pink-600 bg-transparent border-b border-pink-300 focus:outline-none"
            />
          ) : (
            <h3 className="text-2xl font-bold text-pink-600">{post.itemtitle}</h3>
          )}
        </div>

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

        <div className="space-y-2 text-sm text-gray-800">
          <div>
            <strong>Price:</strong>{" "}
            {isEditing ? (
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-b border-pink-300 bg-transparent focus:outline-none"
              />
            ) : (
              <>₹{post.price}</>
            )}
          </div>
          <div>
            <strong>Discount:</strong>{" "}
            {isEditing ? (
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="border-b border-pink-300 bg-transparent focus:outline-none"
              />
            ) : (
              <>{post.discount}%</>
            )}
          </div>
          <div>
            <strong>Quantity:</strong>{" "}
            {isEditing ? (
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-b border-pink-300 bg-transparent focus:outline-none"
              />
            ) : (
              <>{post.quantity}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seeitem;
