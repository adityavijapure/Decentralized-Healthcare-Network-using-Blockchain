import React from 'react';

const InputField = ({ label, icon, type = "text", name, placeholder, onChange, value }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1 group-focus-within:text-white transition-colors">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
            {React.cloneElement(icon, { size: 20 })}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-12' : 'px-5'} pr-5 py-4 rounded-2xl bg-slate-800/50 border border-white/5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600`}
        />
      </div>
    </div>
  );
};

export default InputField;