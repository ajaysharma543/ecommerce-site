import React, { useState } from 'react';
import InputBox from '../../component/input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authservice from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/auth';

function Usersignup({ onswitch }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async ({ name, email, password, phone }) => {
    setError('');
    setLoading(true);

    try {
      const session = await authservice.Createuser({ name, email, password, phone });

      if (session) {
        const userData = await authservice.getCurrentUser();

        if (userData) {
          dispatch(setUser(userData));
          navigate('/userlogin', { replace: true });
        }
      }
    } catch (err) {
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center w-full justify-center">
      <div className="w-[300px] border-2 px-4 py-6 my-20 rounded-2xl border-white">
        <h2 className="text-2xl font-bold text-center text-white">Signup</h2>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">

          <InputBox
            icon="fa-solid fa-user"
            type="text"
            label="Full Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}

          <InputBox
            icon="fa-solid fa-envelope"
            type="email"
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Enter a valid email",
              }
            })}
          />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}

          <InputBox
            icon="fa-solid fa-phone"
            type="number"
            label="Phone Number"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}

          <InputBox
            icon="fa-solid fa-lock"
            type="password"
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" }
            })}
          />
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 h-[35px] w-full rounded-2xl text-white font-semibold transition-all
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Loading..." : "Signup"}
          </button>

          <p className="text-white text-sm text-center mt-2">
            Already have an account?
            <button
              type="button"
              onClick={() => onswitch?.('login')}
              className="underline font-semibold ml-1 cursor-pointer"
            >
              Login
            </button>
          </p>

        </form>
      </div>
    </section>
  );
}

export default Usersignup;