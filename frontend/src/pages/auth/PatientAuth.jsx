import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserIcon, ShieldCheckIcon, FingerPrintIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";

export default function PatientAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-teal-500/20 rounded-xl mb-4 text-teal-400">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Patient {isSignUp ? "Signup" : "Login"}</h1>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {isSignUp && <InputField label="Full Legal Name" name="fullname" icon={<UserIcon />} />}
          <InputField label="Network Email" name="email" type="email" icon={<FingerPrintIcon />} />
          <InputField label="Secure Key" name="password" type="password" icon={<ShieldCheckIcon />} />
          
          <button onClick={() => navigate('/patient/dashboard')} className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl transition-all uppercase tracking-widest text-xs mt-4">
            {isSignUp ? "Initialize Node" : "Access Portal"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isSignUp ? "Already a member?" : "New to the network?"} 
          <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-teal-400 font-bold hover:underline underline-offset-8">
            {isSignUp ? "Login" : "Join Now"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}