import React, { useEffect, useState } from 'react';
import authservice from '../../appwrite/auth';
import service from '../../appwrite/config';

function Alreadycheckout() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = await authservice.getCurrentUser();
        const response = await service.getAllOrderAddresses(user.$id);
        const session = await service.getcartPosts(user.$id);

         if (response && Array.isArray(response.documents)) {
          setOrders(response.documents);
        } 

        if (session) {
          setImages(session.documents);
        }
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleEditClick = (order) => {
    setEditingOrderId(order.$id);
    setEditedData({ ...order });
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = async (orderId) => {
    try {
      await service.updateOrderAddress(orderId, editedData);
      const updatedOrders = orders.map((order) =>
        order.$id === orderId ? { ...order, ...editedData } : order
      );
      setOrders(updatedOrders);
      setEditingOrderId(null);
      setEditedData({});
    } catch (error) {
      console.error("Failed to update order", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authservice.getCurrentUser();
      if (!user) throw new Error("User not logged in");

      const itemsSummary = images
        .map((item) => `${item.title} x${item.quantity}`)
        .join(", ");

      const totalPrice = images.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const response = await service.createorderItem(
        user.$id,
        editedData.fullname || "",
        editedData.address || "",
        editedData.city || "",
        editedData.postalcode || "",
        editedData.country || "",
        editedData.paymentmethod || "creditCard",
        itemsSummary,
        totalPrice.toString()
      );

      for (const item of images) {
        await service.deleteCartpost(item.$id);
      }

      alert("Order placed successfully!");
      console.log("Order response:", response);
    } catch (error) {
      console.error("Order failed:", error);
      alert(`Order failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4 py-10 sm:px-10">
      <h1 className="text-center text-4xl font-extrabold text-white mb-4">🧾 Your Orders</h1>

      {loading ? (
        <p className="text-center text-gray-300 text-lg">Loading your past orders...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-12">
          {orders.map((order) => (
            <div
              key={order.$id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6"
            >
              <div className="mb-6 border-b border-white/20 pb-4">
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">📦 Shipping Address</h2>

                    {editingOrderId === order.$id ? (
                      <>
                        <input
                          name="fullname"
                          value={editedData.fullname}
                          onChange={handleInputChange}
                          className="w-full bg-white/20 text-white p-2 rounded border border-white/30 mb-2"
                          placeholder="Full Name"
                        />
                        <input
                          name="address"
                          value={editedData.address}
                          onChange={handleInputChange}
                          className="w-full bg-white/20 text-white p-2 rounded border border-white/30 mb-2"
                          placeholder="Address"
                        />
                        <input
                          name="city"
                          value={editedData.city}
                          onChange={handleInputChange}
                          className="w-full bg-white/20 text-white p-2 rounded border border-white/30 mb-2"
                          placeholder="City"
                        />
                        <input
                          name="country"
                          value={editedData.country}
                          onChange={handleInputChange}
                          className="w-full bg-white/20 text-white p-2 rounded border border-white/30 mb-2"
                          placeholder="Country"
                        />
                        <input
                          name="postalcode"
                          value={editedData.postalcode}
                          onChange={handleInputChange}
                          className="w-full bg-white/20 text-white p-2 rounded border border-white/30 mb-2"
                          placeholder="Postal Code"
                        />
                        <input
                          name="paymentmethod"
                          value={editedData.paymentmethod}
                          onChange={handleInputChange}
                          className="w-full bg-white/20 text-white p-2 rounded border border-white/30 mb-2"
                          placeholder="Payment Method"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-purple-200 font-medium">👤 {order.fullname}</p>
                        <p className="text-purple-300">📍 {order.address}, {order.city}, {order.country}</p>
                        <p className="text-purple-300">🧾 Postal Code: {order.postalcode}</p>
                        <p className="text-purple-300">💳 Payment Method: {order.paymentmethod}</p>
                      </>
                    )}
                    <p className="text-green-400 font-semibold mt-1">Total price : ₹ {order.totalprice}</p>
                  </div>

                  <div className="mt-4 md:mt-0 flex gap-2">
                    {editingOrderId === order.$id ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingOrderId(null);
                            setEditedData({});
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(order.$id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(order)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-md transition"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">🛒 Ordered Items</h3>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {images.map((item) => (
                      <div
                        key={item.$id}
                        className="bg-white/20 border border-white/30 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start"
                      >
                        <img
                          src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-md shadow-md"
                        />
                        <div className="text-white">
                          <h4 className="font-semibold text-lg">{item.title}</h4>
                          <p className="text-sm text-purple-200">Price: ₹{item.price}</p>
                          <p className="text-sm text-purple-200">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-300 italic">No items found.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-300 text-lg">No previous orders found.</p>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          💰 Proceed To Pay
        </button>
      </div>
    </div>
  );
}

export default Alreadycheckout;













useEffect(() => {
  const fetchItems = async () => {
    try {
      const userData = await authservice.getCurrentUser();
      setUser(userData);

      const session = await service.getAllOrderAddresses(userData.$id);
      const response = await service.getcartPosts(userData.$id);

      // Step 1: Filter for unique addresses (optional if always same)
      let uniqueOrders = [];
      const addressMap = new Map();

      for (const doc of session.documents.reverse()) { // reverse to get newest first
        const key = `${doc.fullname}-${doc.address}-${doc.city}-${doc.postalcode}-${doc.country}`;
        if (!addressMap.has(key)) {
          addressMap.set(key, true);
          uniqueOrders.push(doc);
        }
      }

      setOrders(uniqueOrders); // only one unique order
      if (response?.documents) setImages(response.documents);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  fetchItems();
}, []);
