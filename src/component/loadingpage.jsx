import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authservice from "../appwrite/auth";

const Loading = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authservice.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">
        Loading...
        </div>
  }

  return user ? <Navigate to="/add" /> : children;
};

export default Loading;
