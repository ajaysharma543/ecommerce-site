import { useEffect, useState } from "react";
import service from "../../appwrite/config";
import authservice from "../../appwrite/auth";
import { Link } from "react-router-dom";

function AllOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Start loading
      try {
        const data = await service.getAllOrdersSortedByDate();
        const ordersWithUsers = [];

        for (let order of data) {
          const user = await authservice.getUserDataById(order.userid);
          ordersWithUsers.push({
            ...order,
            name: user?.name || "N/A",
            email: user?.email || "N/A",
          });
        }

        setOrders(ordersWithUsers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">All Orders (Newest First)</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Ordered At</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {orders.map((order, index) => (
              <tr key={order.$id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{order.name}</td>
                <td className="px-6 py-4">{order.email}</td>
                <td className="px-6 py-4 text-black hover:underline">
                  <Link to={`/userdetail/${order.userid}/orders/${order.$id}`}>
                    {order.$id}
                  </Link>
                </td>
                <td className="px-6 py-4">{new Date(order.$createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllOrdersList;
