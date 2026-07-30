import React, { useEffect, useState } from 'react';
import Pagebanner from '../components/pagebanner';
import service from '../../appwrite/config';
import authservice from '../../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 useEffect(() => {
  const fetchCartWithStock = async () => {
    try {
      const user = await authservice.getCurrentUser();
      const cart = await service.getcartPosts(user.$id);

      const cartWithStock = [];
      for (const cartItem of cart.documents) {
        try {
          const product = await service.getitemPost(cartItem.itemid);
          const unitprice = parseFloat(product.price);
          cartWithStock.push({
            ...cartItem,
            stock: parseInt(product.quantity, 10),
            unitprice,
            price: unitprice * parseInt(cartItem.quantity),
          });
        } catch (err) {
          console.error("Failed to fetch stock for", cartItem.itemid, err);
        }
      }

      setPosts(cartWithStock);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCartWithStock();
}, []);

const handleProceedToCheckout = async () => {
  try {
    const user = await authservice.getCurrentUser();
   const alreadydata = await service.getAllOrderAddresses(user.$id);
if (alreadydata && alreadydata.documents.length > 0) {
  navigate('/userlogin/alreadycheckout');
} else {
  navigate('/userlogin/checkout');
}

  } catch (error) {
    console.error("Error checking address:", error);
    navigate('/userlogin/checkout');  
  }
};



 const updateQuantity = async (itemId, newQuantity) => {
  if (newQuantity < 1) return;
  try {
    const rateuptodate = posts.find((item) => item.$id === itemId);
    const newprice = rateuptodate.unitprice * newQuantity;

    await service.updatecartpost(itemId, newQuantity.toString(), newprice.toString());

    setPosts((prevPosts) =>
      prevPosts.map((item) =>
        item.$id === itemId ? { ...item, quantity: newQuantity, price: newprice } : item
      )
    );
  } catch (error) {
    console.error("Failed to update quantity:", error);
  }
};

const handledelete = async (itemId) => {
  try {
    const session = await service.deleteCartpost(itemId);
    if(session){
      setPosts((item) => item.filter((prev) => prev.$id !== itemId))
    }
  } catch (error) {    
  }
}
  return (
    <>
      <Pagebanner title="CART" breadcrumb="Home / Cart" />
      <div className="p-6 w-[95%] mx-auto">
        {loading ? (
          <p className="text-center text-gray-600">Loading cart...</p>
        ) : posts.length > 0 ? (
         <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map((item) => (
              <div key={item.$id} className="relative border rounded-2xl overflow-hidden shadow-lg bg-white">
                <button
                onClick={() => handledelete(item.$id)
                }
                    className="absolute top-0 right-0 bg-red-600 text-white rounded w-10 h-10 flex items-center justify-center text-sm hover:bg-red-700 transition"
                    title="Remove item"
                  >
                    ✕
                </button>
                <img
                  src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
                  alt={item.title}
                  className="w-{80%} h-48 object-cover mx-auto"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-semibold text-green-600">₹{item.price}</p>
                    {item.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        ₹{(item.price / (1 - item.discount / 100)).toFixed(0)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => updateQuantity(item.$id, Number(item.quantity) - 1)}
                      disabled={Number(item.quantity) <= 1}
                      className={`w-9 h-9 flex items-center justify-center rounded-md text-xl font-bold 
                        ${Number(item.quantity) <= 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      −
                    </button>
                    
                    <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.$id, Number(item.quantity) + 1)}
                      disabled={Number(item.quantity) >= Number(item.stock)}
                      className={`w-9 h-9 flex items-center justify-center rounded-md text-xl font-bold 
                        ${Number(item.quantity) >= Number(item.stock) ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      +
                    </button>
                    <p className="text-sm text-gray-500">
                    Available stock: {item.stock}
                  </p>

                  {Number(item.quantity) >= Number(item.stock) && (
                    <p className="text-sm text-red-600 font-medium">Out of stock limit reached</p>
                  )}
                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
         <div className="mt-10 flex justify-end">
          <div className="text-right space-y-4">
            <h2 className="text-2xl font-bold text-white pr-4">
              Total: ₹{posts.reduce((total, item) => total + Number(item.price), 0).toFixed(2)}
            </h2>
            <Link
            onClick={handleProceedToCheckout}
              className="inline-block px-6 py-3 bg-[#b79141] text-white text-lg font-medium rounded hover:bg-[#d0bb74] transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
         </>
        ) : (
          <p className="text-center text-gray-600 text-lg">🛒 No items in cart.</p>
        )}
      </div>
    </>
  );
}

export default Cart;
