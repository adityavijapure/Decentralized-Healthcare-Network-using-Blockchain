import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, X, FileText, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ label, hint, onChange, name, accept = ".pdf,.jpg,.jpeg,.png", required = false }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onChange(file);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    onChange(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <div className="flex items-center justify-between ml-1">
        <label className="text-slate-300 text-xs font-semibold flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-400">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-slate-400 font-medium">
            {hint}
          </span>
        )}
      </div>

      <label className={`relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
        selectedFile 
          ? 'border-emerald-500/50 bg-emerald-500/10' 
          : 'border-white/10 bg-slate-950/70 hover:bg-slate-900/80 hover:border-blue-400/50'
      }`}>
        {selectedFile ? (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-white truncate max-w-[220px]">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium">
                  {formatFileSize(selectedFile.size)} • Ready for S3 upload
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition-colors shrink-0 ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200">
                Click to attach file or drag & drop
              </p>
              <p className="text-[10px] text-slate-500">
                {accept} (Max 10MB)
              </p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          name={name} 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
