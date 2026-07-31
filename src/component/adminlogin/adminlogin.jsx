import React, { useState } from "react";
import InputBox from "../input";
import authservice from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/auth';

const Login = ({ onswitch }) => {
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const showError = (msg) => {
    setError(msg);
    setErrorKey((k) => k + 1); // forces the shake animation to replay
  };

  const handleLogin = async (data) => {
    setError("");
    setLoading(true);

    try {
      const session = await authservice.login(data);

      if (!session) {
        showError("Invalid email or password.");
        return;
      }

      const user = await authservice.getCurrentUser();
      const dbUser = await authservice.getUserDataByEmail(user.email);

      if (!dbUser) {
        showError("We couldn't find an account for this user.");
        return;
      }

      dispatch(setUser(user));

      if (dbUser.role === "admin") {
        navigate("/add", { replace: true });
      } else {
        navigate("/userlogin", { replace: true });
      }
    } catch (err) {
      showError(err?.message || "Login failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      icon: "fa-solid fa-envelope",
      type: "email",
      label: "Email",
      error: errors.email?.message,
      reg: register("email", {
        required: "Email is required",
        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: "Enter a valid email",
        },
      }),
    },
    {
      icon: "fa-solid fa-lock",
      type: "password",
      label: "Password",
      error: errors.password?.message,
      reg: register("password", { required: "Password is required" }),
    },
  ];

  return (
    <section className="w-full px-6 py-8">
      <h2 className="text-xl font-bold text-white text-center mb-1 animate-fade-slide-up" style={{ animationDelay: '0.05s' }}>
        Welcome back
      </h2>
      <p className="text-white/40 text-xs text-center mb-6 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
        Sign in to continue
      </p>

      {error && (
        <div
          key={errorKey}
          className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 animate-shake"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleLogin)} autoComplete="off" className="space-y-5">
        {fields.map((f, i) => (
          <InputBox
            key={f.label}
            icon={f.icon}
            type={f.type}
            label={f.label}
            autoComplete="off"
            error={f.error}
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            className="animate-fade-slide-up"
            {...f.reg}
          />
        ))}

        <div
          className="flex justify-between items-center text-white/50 text-xs animate-fade-slide-up"
          style={{ animationDelay: '0.32s' }}
        >
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="accent-amber-400" /> Remember me
          </label>
          <a href="#" className="hover:text-amber-400 transition-colors">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ animationDelay: '0.4s' }}
          className={`group relative h-[44px] w-full rounded-xl font-semibold text-sm tracking-wide overflow-hidden
            transition-all duration-200 flex items-center justify-center gap-2 animate-fade-slide-up
            ${loading
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-amber-400 text-[#0B0F19] hover:bg-amber-300 active:scale-[0.99]"}
          `}
        >
          {!loading && (
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent
                bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"
            />
          )}
          <span className="relative flex items-center gap-2">
            {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
            {loading ? "Signing in..." : "Sign In"}
          </span>
        </button>

        <p
          className="text-white/40 text-sm text-center pt-1 animate-fade-slide-up"
          style={{ animationDelay: '0.46s' }}
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => onswitch?.('signup')}
            className="text-amber-400 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </section>
  );
};

export default Login;