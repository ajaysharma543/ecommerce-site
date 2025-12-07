import React from "react";
import ItemCard from "./ItemCard";

function ItemGrid({ posts, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xxl w-full mx-auto p-4">
      {posts.map((post) => (
        <div key={post.$id} className="w-full h-full">
          <ItemCard post={post} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}

export default ItemGrid;
