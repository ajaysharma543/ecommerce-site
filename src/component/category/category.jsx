import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../../appwrite/config';

function Category() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service.getPosts([]).then((response) => {
      if (response) {
        setPosts(response.documents);
      }
      setLoading(false); 
    }).catch((error) => {
      console.error('Error fetching posts:', error);
      setLoading(false);
    });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/category/${id}`);
  };
  const handleAddClick = () => {
    navigate("/addcategory");
  };

  return (
    <>
      <div className="w-full py-8 flex justify-center">
        {loading ? (
          <div className="text-xl font-semibold text-gray-500">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-4 gap-20 max-w-7xl w-full px-2">
            
            {posts.map((post) => (
              <div
                key={post.$id}
                onClick={() => handleCardClick(post.$id)}
                className="bg-white rounded-2xl p-4 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-pink-300 border border-transparent cursor-pointer"
              >
                <div className="w-full flex justify-center mb-4 overflow-hidden rounded-xl">
                  <img
                    src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
                    alt={post.category}
                    className="rounded-xl w-full h-40 object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="font-semibold text-lg text-pink-600 group-hover:text-pink-700 transition duration-300">
                  {post.category}
                </h3>
                <p className="text-sm text-gray-700">{post.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-10 z-50" onClick={handleAddClick}>
        <button className="w-16 h-16 cursor-pointer flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
          <span className="text-4xl font-bold pb-2.5">+</span>
        </button>
      </div>
    </>
  );
}

export default Category;
