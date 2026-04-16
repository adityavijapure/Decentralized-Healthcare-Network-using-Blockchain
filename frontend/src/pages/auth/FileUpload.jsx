import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileCheck, X, FileText } from 'lucide-react';

/**
 * Universal FileUpload Component
 * @param {string} label - The field name (e.g., "Registration Certificate")
 * @param {string} hint - Subtext (e.g., "Max 10MB")
 * @param {function} onChange - Returns the file object to the parent state
 */
const FileUpload = ({ label, hint, onChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onChange(file); // Update the parent formData state
    }
  };

  const removeFile = (e) => {
    e.stopPropagation(); // Stop click from bubbling to the hidden input
    setSelectedFile(null);
    onChange(null);
  };

  return (
    <div className="space-y-3 w-full group">
      {/* Dynamic Label */}
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 transition-colors group-hover:text-slate-400">
        {label}
      </label>
      
      <div className="relative">
        {/* Hidden Native File Input */}
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {/* The Designer Container */}
        <div className={`relative border-2 border-dashed rounded-[2rem] p-8 min-h-[160px] flex flex-col items-center justify-center text-center transition-all duration-300 ${
          selectedFile 
            ? 'border-emerald-500/50 bg-emerald-500/5' 
            : 'border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5'
        }`}>
          
          <AnimatePresence mode="wait">
            {selectedFile ? (
              // --- FILE SELECTED VIEW ---
              <motion.div 
                key="file-selected"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center z-30"
              >
                <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
                  <FileCheck size={32} />
                </div>
                
                <p className="text-sm font-bold text-white max-w-[220px] truncate">
                  {selectedFile.name}
                </p>
                
                <p className="text-[9px] text-emerald-500 font-black uppercase mt-1 tracking-widest">
                  Ready for Node Encryption
                </p>

                {/* Remove Button - Higher Z-Index to be clickable over the input */}
                <button 
                  onClick={removeFile}
                  className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-[0.2em] transition-all bg-rose-400/5 px-3 py-1.5 rounded-full border border-rose-400/10"
                >
                  <X size={12} /> Remove File
                </button>
              </motion.div>
            ) : (
              // --- DEFAULT EMPTY VIEW ---
              <motion.div 
                key="no-file"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center pointer-events-none"
              >
                <UploadCloud className="text-slate-500 group-hover:text-blue-400 mb-3 transition-colors duration-300" size={42} />
                
                <p className="text-sm font-medium text-slate-300">
                  Drag & Drop or <span className="text-blue-400 underline underline-offset-4 decoration-blue-400/30">Browse</span>
                </p>
                
                <p className="text-[9px] text-slate-500 uppercase mt-3 font-bold tracking-widest opacity-60">
                  {hint || "Supported: .PDF, .JPG, .PNG (Max 10MB)"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;