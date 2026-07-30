import React, { useEffect, useState } from 'react';
import Pagebanner from './pagebanner';
import { Link, useParams } from 'react-router-dom';
import service from '../../appwrite/config';
import authservice from '../../appwrite/auth';

function Productdetail() {
  const { idslug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const data = await service.getitemPost(idslug);
        setItem(data);

        const user = await authservice.getCurrentUser();
        const cartItems = await service.getcartPosts(user.$id);

        const alreadyInCart = cartItems.documents.some(
          (cartItem) => cartItem.itemid === idslug
        );

        if (alreadyInCart) {
          setAdded(true);
        }
      } catch (error) {
        console.error("Error fetching item or cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [idslug]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const user = await authservice.getCurrentUser();
      await service.createcartCategory(
        user.$id,
        idslug,
        item.itemtitle,
        item.description,
        item.price.toString(),
        item.category,
        item.subcategory,
        item.discount.toString(),
        item.images,
        quantity.toString()
      );
      setAdded(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const increment = () => {
    if (quantity < item.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-medium text-gray-700">
        Loading product details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-xl font-medium text-red-600">
        Failed to load product.
      </div>
    );
  }

  return (
    <>
      <Pagebanner
        title={item.itemtitle}
        breadcrumb={`Home / Shop / ${item.itemtitle}`}
      />

      <section className="bg-white py-16 px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img
              src={`https://fra.cloud.appwrite.io/v1/storage/buckets/681230ec0014d9edea7f/files/${item.images}/download?project=6811dfb70032d153aed8`}
              alt={item.itemtitle}
              className="w-full h-96 object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.itemtitle}</h1>
            <p className="text-lg text-gray-600 mb-6">{item.description}</p>
            <p className="text-3xl font-semibold text-gray-900 mb-4">
              ${item.price.toFixed(2)}
            </p>

            <div className="flex flex-col md:flex-row gap-6 text-gray-600 mb-6">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Subcategory:</strong> {item.subcategory}</p>
            </div>

            {/* Stock + Quantity/Status */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                Available Stock: <span className="font-medium">{item.quantity}</span>
              </div>

              {added ? (
                <span className="inline-block text-green-600 text-sm font-medium mt-2">
                  ✅ Already added to cart. <Link to="/userlogin/cart" className="underline">See Cart</Link>
                </span>
              ) : (
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={decrement}
                    className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-200 text-xl font-bold hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={increment}
                    className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-200 text-xl font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!added ? (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-yellow-600 text-white px-5 py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              ) : (
                <Link
                  to="/userlogin/cart"
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-500 transition"
                >
                  View Cart
                </Link>
              )}

              <Link
                to="/userlogin/shop"
                className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Productdetail;
