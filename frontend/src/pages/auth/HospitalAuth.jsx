import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BuildingOffice2Icon, ArrowLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";

export default function HospitalAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/3 bg-gradient-to-br from-purple-600 to-violet-800 p-12 text-white">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold mb-10 uppercase tracking-widest">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Hospital <br /> Lab <br /> <span className="text-white/40 text-lg">Verification</span></h2>
        </div>

        <div className="flex-1 p-10 lg:p-14 max-h-[90vh] overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="md:col-span-2"><h3 className="text-white font-bold text-xl mb-2">{isSignUp ? "Institutional Onboarding" : "Portal Access"}</h3></div>
            <InputField label="Admin Email" type="email" />
            <InputField label="Access Key" type="password" />

            {isSignUp && (
              <>
                <InputField label="Hospital Name" icon={<BuildingOffice2Icon />} />
                <InputField label="Establishment Year" type="number" icon={<CalendarIcon />} />
                <InputField label="License Number" />
                <InputField label="Medical Council Registration" />
                <div className="md:col-span-2 space-y-4">
                  <FileUpload label="Government Registration Certificate" />
                  <FileUpload label="Hospital Logo" />
                  <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                    <input type="checkbox" className="w-5 h-5 accent-purple-600" />
                    <span className="text-[10px] font-black text-purple-400 uppercase">Compliance Agreement Signed</span>
                  </div>
                </div>
              </>
            )}

            <button onClick={() => navigate('/hospital/dashboard')} className="md:col-span-2 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs mt-4">
              {isSignUp ? "Initialize Hospital Node" : "Access Portal"}
            </button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} className="mt-8 w-full text-center text-slate-500 text-xs font-bold uppercase hover:text-white">
            {isSignUp ? "Return to Sign In" : "Register New Institution"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}