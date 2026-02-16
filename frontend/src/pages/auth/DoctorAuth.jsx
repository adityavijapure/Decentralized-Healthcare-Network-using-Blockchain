import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  UserIcon, AcademicCapIcon, IdentificationIcon, 
  ArrowLeftIcon, FingerPrintIcon, ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";

export default function DoctorAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // Track signup progress
  const navigate = useNavigate();

  // Reset steps when switching between login/signup
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 lg:p-6 font-sans">
      <motion.div 
        layout // Smoothly animates size changes
        className="relative w-full max-w-5xl bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        
        {/* LEFT PANEL: Static Branding */}
        <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex flex-col justify-between text-white transition-all duration-500">
          <div className="z-10">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Selection
            </button>
            <h2 className="text-4xl font-black leading-tight mt-12 tracking-tighter">
              Verified <br /> Doctor <br /> 
              <span className="text-white/40 text-xl font-bold uppercase tracking-widest">Protocol</span>
            </h2>
          </div>
          
          <div className="z-10 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Node Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono opacity-80 text-white">v2.4.0-authorized</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Form Area */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center min-h-[500px] md:min-h-[600px]">
          <div className="max-w-md mx-auto w-full">
            
            <header className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {isSignUp ? (step === 1 ? "Initialize Account" : "Medical Credentials") : "Welcome Back"}
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                {isSignUp ? `Step ${step} of 2: Authorized node registration.` : "Authorized access for verified medical professionals."}
              </p>
            </header>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                
                {/* LOGIN OR SIGNUP STEP 1 (Basic Info) */}
                {(!isSignUp || (isSignUp && step === 1)) && (
                  <motion.div
                    key="account-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <InputField label="Network Email" type="email" icon={<FingerPrintIcon className="w-5 h-5" />} placeholder="dr.smith@healthchain.io" />
                    <InputField label="Secure Key" type="password" icon={<ShieldCheckIcon className="w-5 h-5" />} placeholder="••••••••••••" />
                    
                    {isSignUp && (
                      <InputField label="Full Legal Name" icon={<UserIcon className="w-5 h-5" />} placeholder="Dr. John Smith" />
                    )}
                  </motion.div>
                )}

                {/* SIGNUP STEP 2 (Professional Details) */}
                {isSignUp && step === 2 && (
                  <motion.div
                    key="pro-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="License #" icon={<IdentificationIcon className="w-5 h-5" />} placeholder="MD-9921" />
                      <InputField label="Reg. Year" type="number" placeholder="2024" />
                    </div>
                    <InputField label="Medical Council" placeholder="National Medical Council" />
                    <InputField label="Specialization" icon={<AcademicCapIcon className="w-5 h-5" />} placeholder="Cardiology" />
                    
                    <div className="md:col-span-2">
                      <FileUpload label="Verification Photo Proof" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4">
                {isSignUp && step === 2 && (
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Back
                  </button>
                )}

                <button 
                  onClick={() => {
                    if (isSignUp && step === 1) setStep(2);
                    else navigate('/doctor/dashboard');
                  }}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isSignUp ? (step === 1 ? "Next Protocol" : "Initialize Node") : "Authorize Access"}
                </button>
              </div>
            </form>

            {/* TOGGLE LINK */}
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <button 
                type="button" 
                onClick={toggleMode} 
                className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-all group"
              >
                {isSignUp ? "Already registered? " : "New Doctor? "} 
                <span className="text-blue-400 group-hover:underline underline-offset-8">
                  {isSignUp ? "Sign In" : "Join Network"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}