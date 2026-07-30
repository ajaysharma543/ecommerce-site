import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import service from '../../appwrite/config';

function Subcategory() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {id} = useParams()

  useEffect(() => {
    service.getsubPosts([])
      .then((response) => {
        if (response) {
          setPosts(response.documents);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (postid) => {
navigate(`/viewsub/${postid}`);  
};

  const handleDelete = async (post) => {

    const postDeleted = await service.deletesubpost(post.$id);

    if (postDeleted) {
      setPosts((prev) => prev.filter((item) => item.$id !== post.$id));
    } else {
      console.error("Failed to delete post or file");
    }
  };

  return (
    <>
      <div className="w-full py-8 flex justify-center">
        {loading ? (
          <div className="text-xl font-semibold text-gray-500">Loading subcategories...</div>
        ) : (
          <div className="grid grid-cols-4 gap-8 max-w-7xl w-full px-2">
              {posts.map((post) => (
              <div
                key={post.$id}
                className="bg-white rounded-2xl p-4 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-pink-300 border border-transparent"
              >
                {/* Show Image if Available */}
                {post.images && (
                  <img
          src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
                    alt="subcategory"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="font-semibold text-lg text-pink-600">
                  Category: {post.category}
                </h3>
                <h3 className="font-semibold text-lg text-pink-600">
                  Sub-category: {post.subcategory}
                </h3>
                <p className="text-sm text-gray-700 mb-4">{post.description}</p>

                <div className="flex justify-between gap-2 mt-auto">
                  <button
                    onClick={() => handleUpdate(post.$id)}
                    className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="flex-1 text-sm bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-10 z-50">
        <button
          onClick={() => navigate("/addsub")}
          className="w-16 h-16 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <span className="text-4xl font-bold pb-2.5">+</span>
        </button>
      </div>
    </>
  );
}

export default Subcategory;
