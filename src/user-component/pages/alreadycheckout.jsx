import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import authservice from '../../appwrite/auth';
import { useNavigate } from 'react-router-dom';

function Alreadycheckout() {
  const [order, setOrder] = useState(null);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userData = await authservice.getCurrentUser();
        setUser(userData);

        const latestOrder = await service.getAddressByUserId(userData.$id);
        const response = await service.getcartPosts(userData.$id);

        if (latestOrder) {
          setOrder(latestOrder);
          setEditedOrder(latestOrder);
        }

        if (response?.documents) {
          setImages(response.documents);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
      setOrder(editedOrder);
      setIsEditing(false);
  };

  const handleSaveOrder = async () => {
    if (!user || images.length === 0 || !order) return;

    const totalprice = images.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemDetails = images.map((item) => ({
      id: item.$id,
      itemid : item.itemid,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.images,
    }));

    try {
      const res = await service.createorderItem(
        user.$id,
        order.fullname,
        order.address,
        order.city,
        order.postalcode,
        order.country,
        order.paymentmethod,
        JSON.stringify(itemDetails),
        totalprice.toString()
      );

      for (const item of images) {
        await service.deleteCartpost(item.$id);
      }

      if(res){
        navigate("/userlogin/shop")
      }

      alert('✅ Order placed successfully!');
      console.log('Order Response:', res.itemDetails);
    } catch (error) {
      console.error('❌ Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const orderFields = [
  { name: "fullname", label: "Full Name" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "country", label: "Country" },
  { name: "postalcode", label: "Postal Code" },
  { name: "paymentmethod", label: "Payment Method" },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-center text-gray-100 mb-8">🧾 Your Past Order</h1>

      {!order ? (
        <p className="text-center text-gray-300">No previous orders found.</p>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">📦 Shipping Address</h2>
            {!isEditing ? (
            <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm font-semibold shadow-md transition duration-200"
              >
                ✏️ Edit
              </button>

            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditedOrder(order);
                    setIsEditing(false);
                  }}
                  className="text-sm text-red-400 hover:underline"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="text-sm text-green-400 hover:underline"
                >
                  💾 Save
                </button>
              </div>
            )}
          </div>
             {orderFields.map(({ name, label }) => (
  <div key={name} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 my-2">
    <label className="w-40 text-white font-medium">{label}:</label>
    {isEditing ? (
      <input
        type="text"
        name={name}
        value={editedOrder[name] || ''}
        onChange={handleInputChange}
        className="bg-white/10 border border-white/30 rounded px-3 py-2 text-white flex-1 w-full sm:w-auto"
      />
    ) : (
      <p className="text-white  px-3 py-2 rounded w-full sm:w-auto">{order[name]}</p>
    )}
  </div>
))}

          <h3 className="text-lg font-semibold text-gray-100 mt-4 mb-2">🛒 Items Ordered:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {images.map((item) => (
              <div
                key={item.$id}
                className="bg-white/20 border border-white/30 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4"
              >
                <img
                  src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
                <div className="text-white text-center sm:text-left">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-sm text-purple-200">Quantity: {item.quantity}</p>
                  <p className="text-sm text-purple-200">Price: ₹{item.price *item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-green-300 font-bold text-lg mt-4">
            💰  Total: ₹{images.reduce((total, item) => total + Number(item.price), 0).toFixed(2)}
          </h2>

          <div className="mt-4">
            <button
              onClick={handleSaveOrder}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition duration-200"
            >
              💵 Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alreadycheckout;