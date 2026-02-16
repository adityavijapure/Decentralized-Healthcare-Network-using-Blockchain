import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const FileUpload = ({ label, onChange, name, accept = ".pdf,.jpg,.png" }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      <label className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-slate-800/30 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all cursor-pointer group">
        <CloudArrowUpIcon className="w-10 h-10 text-slate-500 mb-3 group-hover:text-blue-400 transition-colors" />
        <p className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
          Drag & Drop or <span className="underline">Browse</span>
        </p>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
          Supported: {accept} (Max 10MB)
        </p>
        <input 
          type="file" 
          name={name} 
          className="hidden" 
          accept={accept} 
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;