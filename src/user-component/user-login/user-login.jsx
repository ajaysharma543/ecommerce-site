import React, { useState } from 'react';
import InputBox from '../../component/input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authservice from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/auth';

function Usersignup({ onswitch }) {
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch("password");

  const showError = (msg) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const onSubmit = async ({ name, email, password, phone }) => {
    setError('');
    setLoading(true);

    try {
      const session = await authservice.Createuser({ name, email, password, phone });

      if (!session) {
        showError("Signup failed. Please try again.");
        return;
      }

      const userData = await authservice.getCurrentUser();

      if (!userData) {
        showError("Account created, but we couldn't log you in automatically.");
        return;
      }

      dispatch(setUser(userData));
      navigate('/userlogin', { replace: true });
    } catch (err) {
      showError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      icon: "fa-solid fa-user", type: "text", label: "Full Name",
      error: errors.name?.message,
      reg: register("name", { required: "Name is required" }),
    },
    {
      icon: "fa-solid fa-envelope", type: "email", label: "Email",
      error: errors.email?.message,
      reg: register("email", {
        required: "Email is required",
        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: "Enter a valid email",
        }
      }),
    },
    {
      icon: "fa-solid fa-phone", type: "tel", label: "Phone Number",
      error: errors.phone?.message,
      reg: register("phone", {
        required: "Phone number is required",
        pattern: { value: /^[0-9]{7,15}$/, message: "Enter a valid phone number" }
      }),
    },
    {
      icon: "fa-solid fa-lock", type: "password", label: "Password",
      error: errors.password?.message,
      reg: register("password", {
        required: "Password is required",
        minLength: { value: 6, message: "Minimum 6 characters" }
      }),
    },
    {
      icon: "fa-solid fa-lock", type: "password", label: "Confirm Password",
      error: errors.confirmPassword?.message,
      reg: register("confirmPassword", {
        required: "Please confirm your password",
        validate: (value) => value === password || "Passwords do not match"
      }),
    },
  ];

  return (
    <section className="w-full px-6 py-4">
      <h2 className="text-xl font-bold text-white text-center mb-1 animate-fade-slide-up" style={{ animationDelay: '0.05s' }}>
        Create account
      </h2>
      <p className="text-white/40 text-xs text-center mb-3 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
        Join in a few seconds
      </p>

      {error && (
        <div
          key={errorKey}
          className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 animate-shake"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fields.map((f, i) => (
          <InputBox
            key={f.label}
            icon={f.icon}
            type={f.type}
            label={f.label}
            error={f.error}
            style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            className="animate-fade-slide-up"
            {...f.reg}
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{ animationDelay: '0.55s' }}
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
            {loading ? "Creating account..." : "Sign Up"}
          </span>
        </button>

        <p
          className="text-white/40 text-sm text-center pt-1 animate-fade-slide-up"
          style={{ animationDelay: '0.62s' }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onswitch?.('login')}
            className="text-amber-400 font-semibold hover:underline"
          >
            Log in
          </button>
        </p>

      </form>
    </section>
  );
}

export default Usersignup;