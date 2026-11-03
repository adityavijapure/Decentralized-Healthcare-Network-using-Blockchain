import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ 
  label, 
  icon, 
  type = "text", 
  name, 
  placeholder, 
  onChange, 
  value, 
  helperText,
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full group text-left">
      <div className="flex items-center justify-between ml-1">
        <label className="text-slate-300 text-xs font-semibold group-focus-within:text-white transition-colors flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-400">*</span>}
        </label>
        {helperText && (
          <span className="text-[10px] text-slate-400 font-medium">
            {helperText}
          </span>
        )}
      </div>

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors pointer-events-none">
            {React.cloneElement(icon, { size: 18 })}
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-11' : 'pr-4'} py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-500`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
