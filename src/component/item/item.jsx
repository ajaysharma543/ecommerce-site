import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemGrid from "./item-components/itemgrid";
import service from "../../appwrite/config";
import { Query } from "appwrite";

function Item() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const response = await service.getitemPosts([Query.limit(100)]);

        if (!response || !response.documents) {
          console.warn("No items found or service response failed.");
          navigate("/");
          return;
        }

        const documents = response.documents;

        if (category.toLowerCase() === "home") {
          setPosts(documents);
        } else {
          const filtered = documents.filter(
            (doc) =>
              doc.category &&
              doc.category.toLowerCase() === category.toLowerCase()
          );
          setPosts(filtered);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category, navigate]);

  const handleDelete = async (post) => {
    try {
      if (!post.images) {
        console.error("No image found to delete.");
        return;
      }

      const fileDeleted = await service.deleteFile(post.images);
      const postDeleted = await service.deletepost(post.$id);

      if (fileDeleted && postDeleted) {
        setPosts((prev) => prev.filter((item) => item.$id !== post.$id));
      } else {
        console.error("Failed to delete post or file.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleAddClick = () => {
    navigate("/additem");
  };

  return (
    <>
      <div className="w-full flex justify-center mt-8">
        {loading ? (
          <div className="text-xl font-semibold text-gray-500 animate-pulse">
            Loading {category} Items...
          </div>
        ) : posts.length > 0 ? (
          <ItemGrid posts={posts} onDelete={handleDelete} />
        ) : (
          <div className="text-lg text-gray-400">No items found in this category.</div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleAddClick}
          className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-4xl rounded-full shadow-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center"
        >
          +
        </button>
      </div>
    </>
  );
}

export default Item;
