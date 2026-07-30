import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import service from "../../appwrite/config";
import authservice from "../../appwrite/auth";

const UserDetails = () => {
  const { userid } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await service.getAllOrdersByUserId(userid);
        const ordersWithUsers = [];

        for (let order of res) {
          const user = await authservice.getUserDataById(order.userid);
          ordersWithUsers.push({
            ...order,
            name: user?.name || 'N/A',
            email: user?.email || 'N/A',
          });
        }

        setOrders(ordersWithUsers);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userid]);

  if (loading) return <p className="text-center mt-10 text-white">Loading user details...</p>;
  if (orders.length === 0) return <p className="text-center mt-10">No orders found for this user.</p>;

  // Extract user info from the first order
  const { name, email, userid: id } = orders[0];

  return (
    <div className="w-[85%] mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">👤 User Details</h1>
      <p><strong>Full Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>User ID:</strong> {id}</p>

      <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-3">🧾 Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Order Date</th>
              <th className="px-4 py-2 border">Order Time</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {orders.map((order, index) => (
              <tr key={order.$id} className="hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border font-mono text-black">
                  <Link
                    to={`/userdetails/${order.userid}/order/${order.$id}`}
                    className="hover:underline"
                  >
                    {order.$id}
                  </Link>
                </td>
                <td className="px-4 py-2 border">
                  {new Date(order.$createdAt).toLocaleDateString()}
                  </td>
                <td className="px-4 py-2 border">
                  {new Date(order.$createdAt).toLocaleTimeString()}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;
