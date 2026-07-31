import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Login from '../component/adminlogin/adminlogin';
import Usersignup from '../user-component/user-login/user-login';
import AnimatedAuthBackground from './AnimatedAuthBackground'; // adjust path to where you save it

function Toggle() {
  const [isLogin, setIsLogin] = useState(true);
  const [direction, setDirection] = useState('right');
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
    const goingToLogin = screen === 'login';
    if (goingToLogin === isLogin) return;
    setDirection(goingToLogin ? 'left' : 'right');
    setIsLogin(goingToLogin);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] px-4 py-10 relative overflow-hidden">
      <AnimatedAuthBackground />

      <div className="relative w-full max-w-[380px] animate-fade-slide-up">
        <div className="relative grid grid-cols-2 rounded-t-2xl overflow-hidden bg-white/5 border border-white/10 border-b-0">
          {['login', 'signup'].map((screen) => {
            const active = (screen === 'login') === isLogin;
            return (
              <button
                key={screen}
                type="button"
                onClick={() => handleSwitch(screen)}
                className={`relative py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 cursor-pointer
                  ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}
                `}
              >
                {screen === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            );
          })}
          <span
            className="absolute bottom-0 h-[2px] w-1/2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 transition-transform duration-300 ease-out"
            style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(100%)' }}
          />
        </div>

        <div className="relative rounded-b-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden">
          <div
            key={isLogin ? 'login' : 'signup'}
            className={direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
          >
            {isLogin ? (
              <Login onswitch={handleSwitch} />
            ) : (
              <Usersignup onswitch={handleSwitch} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toggle;