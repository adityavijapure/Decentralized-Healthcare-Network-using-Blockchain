import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  X,
  KeyRound
} from "lucide-react";

export default function AuthStatusDialog({
  isOpen,
  type = "success", // 'success' | 'error' | 'info'
  title,
  message,
  role = "Patient", // 'Patient' | 'Doctor' | 'Hospital'
  onClose,
  actionText
}) {
  if (!isOpen) return null;

  // Role-based gradient theming
  const themeConfig = {
    Patient: {
      gradient: "from-teal-500 to-emerald-600",
      glow: "bg-teal-500/20",
      border: "border-teal-500/30",
      iconBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      button: "from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 shadow-teal-500/25",
      ring: "ring-teal-500/30"
    },
    Doctor: {
      gradient: "from-blue-600 to-indigo-600",
      glow: "bg-blue-600/20",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      button: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25",
      ring: "ring-blue-500/30"
    },
    Hospital: {
      gradient: "from-purple-600 to-violet-600",
      glow: "bg-purple-600/20",
      border: "border-purple-500/30",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      button: "from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-purple-500/25",
      ring: "ring-purple-500/30"
    }
  };

  const theme = themeConfig[role] || themeConfig.Patient;
  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Animated Dim Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className={`relative w-full max-w-md rounded-3xl bg-slate-900/90 border ${
            isSuccess ? theme.border : "border-rose-500/30"
          } p-7 text-center shadow-2xl backdrop-blur-2xl overflow-hidden`}
        >
          {/* Ambient Inner Glow */}
          <div
            className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              isSuccess ? theme.glow : "bg-rose-500/20"
            }`}
          />
          <div
            className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              isSuccess ? theme.glow : "bg-rose-500/20"
            }`}
          />

          {/* Close 'X' button (for error / dismissal) */}
          {onClose && !isSuccess && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Icon Badge with Pulse Ripple Animation */}
          <div className="relative mx-auto mb-5 w-20 h-20 flex items-center justify-center">
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full ${
                isSuccess ? theme.glow : "bg-rose-500/20"
              }`}
            />
            
            <div
              className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
                isSuccess
                  ? `${theme.iconBg} ${theme.ring}`
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30 ring-rose-500/30"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>
          </div>

          {/* Status Title */}
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">
            {title || (isSuccess ? "Success!" : "Action Required")}
          </h3>

          {/* Status Message Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
            {message}
          </p>

          {/* Animated Redirect Progress Bar (When Success) */}
          {isSuccess && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Authorizing JWT Session</span>
                </span>
                <span className="text-emerald-400 font-bold">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className={`h-full bg-gradient-to-r ${theme.gradient}`}
                />
              </div>
            </div>
          )}

          {/* Action / Dismiss Button */}
          {onClose && (
            <button
              onClick={onClose}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 active:scale-98 ${
                isSuccess
                  ? `bg-gradient-to-r ${theme.button}`
                  : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/25"
              }`}
            >
              <span>{actionText || (isSuccess ? "Redirecting Now..." : "Understood")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Security Verification Footer */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HealthChain Cloud Security • Neon PostgreSQL</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
