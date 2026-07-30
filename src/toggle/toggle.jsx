import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Login from '../component/adminlogin/adminlogin';
import Usersignup from '../user-component/user-login/user-login';

function Toggle() {
  const [isLogin, setIsLogin] = useState(true);
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (role === 'admin') {
        navigate('/add', { replace: true });
      } else if (role === 'user') {
        navigate('/userlogin', { replace: true });
      }
    }
  }, [isLoggedIn, role, navigate]);

  const handleSwitch = (screen) => {
    setIsLogin(screen === 'login');
  };

  return (
    <div className="flex justify-center bg-black">
      {isLogin ? (
        <Login onswitch={handleSwitch} />
      ) : (
        <Usersignup onswitch={handleSwitch} />
      )}
    </div>
  );
}

export default Toggle;
