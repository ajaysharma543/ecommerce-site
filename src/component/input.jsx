import React from 'react';
import { useId } from 'react';

const InputBox = ({ icon, label, children, name,id, ...rest }) => {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="relative w-full my-[30px] border-b-2  border-white">
    <span className="absolute right-2 text-white text-[1.2rem] leading-[57px] cursor-pointer">
        <i className={icon}></i>
      </span>
      <input   
        {...rest}
        name={name}
        id={inputId}
        placeholder=" "
        required
        
        className="peer w-full h-[50px] bg-transparent border-2 border-none border-white outline-none text-white text-[1rem] px-[5px] pr-[35px]"
      />

      <label className="absolute left-[5px] text-white text-[1rem] transform transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-5px]">
        {label}
      </label>
      
      {children}
    </div>
  );
};

export default InputBox;