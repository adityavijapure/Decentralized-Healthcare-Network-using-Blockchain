import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { UserIcon, ShieldCheckIcon, FingerPrintIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";

export default function PatientAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleAction = async () => {
    // --- LOGIN LOGIC ---
    if (!isSignUp) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8085/api/auth/patient/login", {
          email: formData.email,
          password: formData.password
        });

        // 1. SAVE TO LOCALSTORAGE
        // We save the email from the form and the name from the server response
        localStorage.setItem("userEmail", formData.email);
        
        // If your backend returns the user object, use response.data.fullname
        // Otherwise, we fallback to a generic name for now
        const displayName = response.data.fullname || "Patient User";
        localStorage.setItem("userFullname", displayName); 

        alert("Login Successful!");
        navigate('/patient/dashboard');
      } catch (err) {
        alert("Login failed: " + (err.response?.data || "Server unreachable"));
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- SIGNUP + BLOCKCHAIN LOGIC ---
    if (!window.ethereum) {
      alert("MetaMask not found! Please install the extension.");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Cryptographic signature to anchor the identity
      const signature = await signer.signMessage(`Registering to HealthChain: ${formData.email}`);

      const response = await axios.post("http://localhost:8085/api/auth/patient/signup", {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        walletAddress: walletAddress 
      });

      // 2. SAVE TO LOCALSTORAGE
      // During signup, we already have the fullname in our formData
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userFullname", formData.fullname);

      alert(`Node Initialized!\nWallet: ${walletAddress.substring(0, 10)}...`);
      navigate('/patient/dashboard');

    } catch (err) {
      console.error("Initialization failed:", err);
      const errorMsg = err.code === "ACTION_REJECTED" 
        ? "User rejected blockchain signature." 
        : "Connection failed. Check if Backend is on 8085.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
      >
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </button>
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-teal-500/20 rounded-xl mb-4 text-teal-400">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Patient {isSignUp ? "Initialization" : "Login"}
          </h1>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {isSignUp && (
            <InputField 
              label="Full Legal Name" 
              value={formData.fullname}
              onChange={(e) => setFormData({...formData, fullname: e.target.value})}
              icon={<UserIcon className="w-5 h-5" />} 
            />
          )}
          <InputField 
            label="Network Email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            type="email" 
            icon={<FingerPrintIcon className="w-5 h-5" />} 
          />
          <InputField 
            label="Secure Key" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            type="password" 
            icon={<ShieldCheckIcon className="w-5 h-5" />} 
          />
          
          <button 
            onClick={handleAction} 
            disabled={loading}
            className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl transition-all uppercase tracking-widest text-xs mt-4 disabled:opacity-50 shadow-lg shadow-teal-500/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isSignUp ? "Initialize Node" : "Access Portal"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isSignUp ? "Already a member?" : "New to the network?"} 
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="ml-2 text-teal-400 font-bold hover:underline underline-offset-8"
          >
            {isSignUp ? "Login" : "Join Now"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}