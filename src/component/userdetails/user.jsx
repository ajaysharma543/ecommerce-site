import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import authservice from '../../appwrite/auth';
import { Link } from 'react-router-dom';

const LatestOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const allOrders = await service.getLatestOrderPerUniqueUser();
        const ordersWithUsers = [];

        for (let order of allOrders) {
          const user = await authservice.getUserDataById(order.userid);
          ordersWithUsers.push({
            ...order,
            name: user?.name || 'N/A',
            email: user?.email || 'N/A',
          });
        }

        setOrders(ordersWithUsers);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return loading ? (
    <div className="flex items-center justify-center ">
      <p className="text-white  pt-10 font-semibold">Loading...</p>
    </div>
  ) : (
    <div className="p-4 bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Latest Orders Per User</h2>
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">User ID</th>
            <th className="px-4 py-2 border">Created Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.$id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
         <td className="border px-4 py-2">
            <Link to={`/userdetails/${order.userid}`} className="text-black hover:underline">
              {order.name}
            </Link>
          </td>
          <td className="border px-4 py-2">
            <Link to={`/userdetails/${order.userid}`} className="text-black hover:underline">
              {order.email}
            </Link>
          </td>
          <td className="border px-4 py-2">
            <Link to={`/userdetails/${order.userid}`} className="text-black hover:underline">
              {order.userid}
            </Link>
          </td>

              <td className="border px-4 py-2">
                {new Date(order.$createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestOrdersTable
