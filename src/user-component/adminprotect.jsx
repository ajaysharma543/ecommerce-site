// component/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  if (!isLoggedIn || role === "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
