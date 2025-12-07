import React, { useState } from "react";
import InputBox from "../input";
import authservice from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/auth';

const Login = ({ onswitch }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      setError("");

      const session = await authservice.login(data);

      if (session) {
        const user = await authservice.getCurrentUser();
        const dbUser = await authservice.getUserDataByEmail(user.email);

        if (!dbUser) {
          setError("User not found in database.");
          setLoading(false);
          return;
        }

        dispatch(setUser(user));

        if (dbUser.role === "admin") {
          navigate("/add", { replace: true });
        } else {
          navigate("/userlogin", { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  return (
    <section className="flex items-center w-full justify-center min-h-screen">
      <div className="w-[300px] border-2 px-4 py-5 rounded-2xl border-white bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(handleLogin)} autoComplete="off">
          <InputBox
            icon="fa-solid fa-user"
            type="email"
            label="Email"
            autoComplete="off"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

          <InputBox
            icon="fa-solid fa-lock"
            type="password"
            label="Password"
            autoComplete="off"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

          <div className="flex justify-between mt-2 text-white text-sm">
            <label>
              <input type="checkbox" className="mr-1" /> Remember me
            </label>
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 h-[30px] w-full rounded-2xl transition 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="text-white text-sm text-center mt-2">
            Don't have an account?
            <button
              type="button"
              onClick={() => onswitch?.('signup')}
              className="underline font-semibold ml-1 cursor-pointer"
            >
              Signup
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
