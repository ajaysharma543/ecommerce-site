import React, { useEffect, useState } from "react";
import authservice from "../../appwrite/auth";
import service from "../../appwrite/config";
import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRandomStatus = () => {
    return Math.random() < 0.5 ? "Pending" : "Delivered";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = await authservice.getCurrentUser();
        const userId = user?.$id;
        const result = await service.getAllOrdersByUserId(userId);

        const ordersWithStatus = result.map((order) => ({
          ...order,
          status: getRandomStatus(),
        }));

        setOrders(ordersWithStatus);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-white text-lg">Loading your orders...</div>;
  }

  return (
    <div className="p-6 w-full mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-600 pb-2">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">You haven’t placed any orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          {orders.map((order) => {
            const items = JSON.parse(order.items || "[]");

            return (
              <div
                key={order.$id}
                className="border border-gray-700 rounded-xl p-6 shadow-md bg-gray-900"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Order #{order.$id}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-yellow-600/20 text-yellow-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-700 rounded-md p-3 bg-gray-800 hover:scale-[1.01] transition"
                      >
                        <Link to={`/userlogin/product/${item.itemid}`}>
                          <img
                            src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.image}/download?project=6811dfb70032d153aed8`}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded mb-2 cursor-pointer"
                          />
                       
                        <div>
                          <p className="text-sm"><strong>Title:</strong> {item.title}</p>
                          <p className="text-sm"><strong>Unit Price:</strong> ₹{item.price}</p>
                          <p className="text-sm"><strong>Quantity:</strong> {item.quantity}</p>
                          <p className="text-sm"><strong>Subtotal:</strong> ₹{item.price * item.quantity}</p>
                        </div>
                         </Link>
                      </div>
                    ))}
                  </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <p><strong>Name:</strong> {order.fullname}</p>
                  <p><strong>City:</strong> {order.city}</p>
                  <p><strong>Country:</strong> {order.country}</p>
                  <p><strong>Total Price:</strong> ₹{order.totalprice}</p>
                  <p><strong>Payment:</strong> {order.paymentmethod}</p>
                  <p><strong>Ordered:</strong> {new Date(order.$createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
