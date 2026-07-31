import React, { useId, useState } from 'react';

const InputBox = ({ icon, label, children, name, id, error, type, style, ...rest }) => {
  const autoId = useId();
  const inputId = id || autoId;
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full" style={style}>
      <div
        className={`relative w-full border-b-2 transition-all duration-300
          ${error ? 'border-red-500' : focused ? 'border-amber-400' : 'border-white/30'}
        `}
      >
        {/* focus glow */}
        <span
          className={`pointer-events-none absolute inset-x-0 -bottom-[1px] h-[2px] bg-amber-400 origin-center transition-transform duration-300
            ${focused && !error ? 'scale-x-100' : 'scale-x-0'}
          `}
        />

        <span
          className={`absolute left-1 text-[1rem] leading-[52px] pointer-events-none transition-colors duration-300
            ${error ? 'text-red-400' : focused ? 'text-amber-400' : 'text-white/50'}
          `}
        >
          <i className={icon}></i>
        </span>

        <input
          {...rest}
          type={resolvedType}
          name={name}
          id={inputId}
          placeholder=" "
          required
          aria-invalid={!!error}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          className="peer w-full h-[52px] bg-transparent outline-none border-none
            text-white text-[1rem] pl-[30px] pr-[36px]"
        />

        <label
          htmlFor={inputId}
          className="absolute left-[30px] text-white/60 text-[0.95rem] transform transition-all duration-300
            top-1/2 -translate-y-1/2
            peer-focus:top-[-2px] peer-focus:text-[0.75rem] peer-focus:text-amber-400
            peer-[:not(:placeholder-shown)]:top-[-2px] peer-[:not(:placeholder-shown)]:text-[0.75rem]
            peer-autofill:top-[-2px] peer-autofill:text-[0.75rem]"
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-1 text-white/50 hover:text-amber-400 text-[1rem] leading-[52px] transition-colors duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
          </button>
        )}

        {children}
      </div>

      <p
        className={`text-red-400 text-xs mt-1 flex items-center gap-1 overflow-hidden transition-all duration-300
          ${error ? 'max-h-6 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}
        `}
      >
        <i className="fa-solid fa-circle-exclamation text-[0.7rem]"></i>
        {error}
      </p>
    </div>
  );
};

export default InputBox;