import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import service from '../../appwrite/config';

function SeeCategory() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    service.getPost(id).then((response) => {
      if (response) {
        setPost(response);
      } else {
        navigate("/");
      }
    });
  }, [id, navigate]);

  if (!post) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="flex justify-center items-start bg-gray-50">
      <div
        className="max-w-xl w-full bg-white rounded-3xl p-4 shadow-xl border border-transparent 
        hover:border-pink-400 transition-all duration-300 transform hover:scale-105"
      >
        <button
          onClick={() => navigate(-1)}
          className=" px-4 py-2 m-2 cursor-pointer bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all"
        >
          ← Back
        </button>
        <div className="relative overflow-hidden rounded-2xl mb-6 max-h-80">
          <img
            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
            alt={post.category}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
          {post.category}
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          {post.description}
        </p>
      </div>
    </div>
  );
}

export default SeeCategory;
