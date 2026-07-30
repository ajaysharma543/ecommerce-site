import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import service from "../../appwrite/config";

const OrderDetails = () => {
  const { userid, orderid } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const allOrders = await service.getAllOrdersByUserId(userid);
        const selectedOrder = allOrders.find((o) => o.$id === orderid);
        setOrder(selectedOrder);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [userid, orderid]);

  if (loading) return <p className="text-center mt-10 text-white">Loading order details...</p>;
  if (!order) return <p className="text-center mt-10 text-white">Order not found.</p>;

  const {
    fullname,
    address,
    city,
    country,
    postalCode,
    paymentmethod,
    $createdAt,
    $id,
    parsedItems = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [],
  } = order;

  return (
    <div className="w-[90%] md:w-[85%] mx-auto mt-10 p-6 bg-white shadow-2xl rounded-lg border border-gray-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">📦 Order Details</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div>
          <p><strong>🆔 Order ID:</strong> {$id}</p>
          <p><strong>📅 Date:</strong> {new Date($createdAt).toLocaleDateString()}</p>
          <p><strong>⏰ Time:</strong> {new Date($createdAt).toLocaleTimeString()}</p>
        </div>
        <div>
          <p><strong>👤 Full Name:</strong> {fullname || "Unnamed"}</p>
          <p><strong>🆔 User ID:</strong> {userid}</p>
          <p><strong>💳 Payment Method:</strong> {paymentmethod || "N/A"}</p>
        </div>
      </div>

      {/* Address */}
      {(address || city || country || postalCode) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📍 Shipping Address</h2>
          <div className="bg-gray-100 p-4 rounded shadow text-gray-800 space-y-1">
            {address && <p>{address}</p>}
            {city && <p><strong>City:</strong> {city}</p>}
            {postalCode && <p><strong>Postal Code:</strong> {postalCode}</p>}
            {country && <p><strong>Country:</strong> {country}</p>}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">🛒 Ordered Items</h2>
          <div className="flex flex-col space-y-6 p-4">
          {parsedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row gap-4 items-start border rounded-lg p-4 shadow-sm w-auto"
            >
              <img
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.image}/download?project=6811dfb70032d153aed8`}
                alt={item.title}
                className="w-auto max-w-[160px] h-auto object-contain rounded border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 mt-1"><strong>Quantity:</strong> {item.quantity}</p>
                <p className="text-gray-600"><strong>Price:</strong> ₹{parseFloat(item.price).toFixed(2)}</p>
                <p className="text-green-700 font-medium mt-1">
                  <strong>Total:</strong> ₹{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default OrderDetails;
