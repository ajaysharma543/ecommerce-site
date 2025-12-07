import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Add from './component/adminlogin/add';
import AdminLayout from './component/adminlogin/layout';
import authservice from './appwrite/auth';
import Category from './component/category/category';
import Addcategory from './component/category/addcategory';
import Loading from './component/loadingpage';
import Seecategory from './component/category/seecategory';
import { logoutUser, setUser } from './store/auth';
import Item from './component/item/item';
import Additem from './component/item/additem';
import Seeitem from './component/item/seeitem';
import Subcategory from './component/sub-category/subcategory';
import Addsub from './component/sub-category/addsub';
import Itemheader from './component/item/itemheader';
import Viewsub from './component/sub-category/viewsub';
import Toggle from './toggle/toggle';

import Home from './user-component/pages/home';
import About from './user-component/pages/about';
import Shop from './user-component/pages/shop';
import Cart from './user-component/pages/cart';
import Contact from './user-component/pages/contact';
import UserLayout from './component/adminlogin/userlogout';
import Categorypage from './user-component/components/categorypage';
import CategoryItems from './user-component/components/categorypage';
import ProtectedRoute from './user-component/protect';
import Footer from './user-component/components/footer';
import Productdetail from './user-component/components/productdetail';
import Checkout from './user-component/pages/checkout';
import Alreadycheckout from './user-component/pages/alreadycheckout';
import Orders from './user-component/pages/orders';
import User from './component/userdetails/user';
import UserDetails from './component/userdetails/userdetails';
import Userdetail from './component/userdetails/userdetail';
import OrderDetail from './component/userdetails/userdetail';
import Orderdetail from './component/orderdetails/orderdetail';
import OrderDetails from './component/orderdetails/perordredetails';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authservice.logout();
      dispatch(logoutUser());
      console.log("Logged out");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

 useEffect(() => {
  const checkSession = async () => {
    try {
      const userData = await authservice.getCurrentUser();
      if (userData) {
        dispatch(setUser(userData));
      }
    } catch (error) {
      if (error.message.includes("missing scope") || error.code === 401) {
        dispatch(logoutUser());
      } else {
        console.error('Session check failed:', error);
      }
    }
  };
  checkSession();
}, [dispatch]);

  const showFooter = location.pathname.startsWith("/userlogin");

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Loading><Toggle /></Loading>} />

        {/* Admin Routes */}
        <Route
          element={
              <ProtectedRoute allowedRole="admin">
              <AdminLayout Logouthandler={handleLogout} />
            </ProtectedRoute>
          }>
          <Route path="/add" element={<Add />} />
          <Route path="/category" element={<Category />} />
          <Route path="/addcategory" element={<Addcategory />} />
          <Route path="/details" element={<User />} />
          <Route path="/order" element={<Orderdetail />} />
          <Route path="/userdetails/:userid" element={<UserDetails />} />
          <Route path="/userdetails/:userid/order/:orderid" element={<Userdetail />} />
          <Route path="/userdetail/:userid/orders/:orderid" element={<OrderDetails />} />
          <Route path="/category/:id" element={<Seecategory />} />
          <Route path="/additem" element={<Additem />} />
          <Route path="/seeitem/:id" element={<Seeitem />} />
          <Route path="/subcategory" element={<Subcategory />} />
          <Route path="/addsub" element={<Addsub />} />
          <Route path="/viewsub/:id" element={<Viewsub />} />
          <Route path="/item" element={<Navigate to="/items/home" replace />} />
          <Route path="/items" element={<Itemheader />}>
          <Route index element={<Navigate to="/items/home" replace />} />
          <Route path=":category" element={<Item />} />
          </Route>
        </Route>

        {/* User Routes */}
        <Route
          path="/userlogin"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout Logouthandler={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="shop" element={<Shop />} />
          <Route path="contact" element={<Contact />} />
          <Route path="order" element={<Orders />} />
          <Route path="cart" element={<Cart />} />
          <Route path=":categoryitem" element={<Categorypage />} />
          <Route path="category/:categorySlug" element={<CategoryItems />} />
          <Route path="product/:idslug" element={<Productdetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="alreadycheckout" element={<Alreadycheckout />} />


        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
          {showFooter && <Footer />}

    </div>

  );
}

export default App;
