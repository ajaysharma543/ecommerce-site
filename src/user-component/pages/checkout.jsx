import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagebanner from "../components/pagebanner";
import service from "../../appwrite/config";
import authservice from "../../appwrite/auth";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "creditCard",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = await authservice.getCurrentUser();
        if (user) {
          const session = await service.getcartPosts(user.$id);
          if (session) {
            setCartItems(session.documents);
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);
const totalPrice = cartItems
  .reduce((total, item) => total + item.price * item.quantity, 0)
  .toFixed(2);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userData = await authservice.getCurrentUser();
    if (!userData) throw new Error("User not logged in");

       const itemsSummary = cartItems.map((item) => ({
      id: item.$id,
      itemid : item.itemid,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.images,
    }));


    // Create the order
    const response = await service.createorderItem(
      userData.$id,
      formData.fullName,
      formData.address,
      formData.city,
      formData.postalCode,
      formData.country,
      formData.paymentMethod,
      JSON.stringify(itemsSummary),
        totalPrice.toString()
    );

    for (const item of cartItems) {
      await service.deleteCartpost(item.$id);
    }
    if(response){
      navigate("/userlogin/shop")
    }
    alert("Order placed successfully!");
    console.log("Order response:", response);
  } catch (error) {
    console.error("Order failed:", error);
    alert(`Order failed: ${error.message}`);
  }
};



  return (
    <>
      <Pagebanner title="CHECKOUT" breadcrumb="Home / Cart / Checkout" />
      <div className="max-w-7xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading your cart...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Your cart is empty.</p>
            <Link
              to="/shop"
              className="bg-[#b79141] text-white px-6 py-3 rounded-md hover:bg-[#d0bb74] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Shipping & Payment Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1 text-white">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#b79141]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#b79141]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#b79141]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#b79141]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#b79141]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#b79141]"
                  >
                    <option value="creditCard" >Credit Card</option>
                    <option value="paypal" className="bg-black">PayPal</option>
                    <option value="bankTransfer" className="bg-black">Bank Transfer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#b79141] text-white px-6 py-3 rounded-md hover:bg-[#d0bb74] transition-colors"
                >
                  Place Order
                </button>
              </form>
            </div>

            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="bg-white text-black shadow-md rounded-lg p-4">
                {cartItems.map((item) => (
                  <div key={item.$id} className="flex justify-between mb-5 border border-gray-400 rounded-md shadow-md p-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Checkout;
