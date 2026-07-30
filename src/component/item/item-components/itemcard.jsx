import { useNavigate } from "react-router-dom";

function ItemCard({ post, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/seeitem/${post.$id}`);
  const handleUpdate = () => navigate(`/seeitem/${post.$id}`);

  return (
    <div className="w-full h-full flex flex-col bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      <div
        onClick={handleClick}
        className="w-full h-48 overflow-hidden rounded-md mb-4 cursor-pointer"
      >
        <img
          src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${post.images}/download?project=6811dfb70032d153aed8`}
          alt={post.itemtitle}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3
        onClick={handleClick}
        className="text-lg font-semibold text-gray-800 mb-2 truncate cursor-pointer hover:text-pink-500 transition-colors"
      >
        {post.itemtitle}
      </h3>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2 italic">
        {post.description}
      </p>

      <div className="text-sm text-gray-700 mb-4 space-y-1">
        <p>
          <span className="font-medium">Price:</span>{" "}
          <span className="text-green-600 font-semibold">₹{post.price}</span>
        </p>
        <p>
          <span className="font-medium">Discount:</span>{" "}
          <span className="text-red-500">{post.discount}%</span>
        </p>
        <p>
          <span className="font-medium">Quantity:</span>{" "}
          <span className="text-blue-500">{post.quantity}</span>
        </p>
      </div>

      <div className="flex justify-between mt-auto gap-2">
        <button
          onClick={handleUpdate}
          className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(post)}
          className="flex-1 text-sm bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
