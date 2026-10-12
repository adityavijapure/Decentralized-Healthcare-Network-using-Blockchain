import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { UserIcon, ShieldCheckIcon, FingerPrintIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload"; // Added for Profile/Document upload
import { API_BASE_URL } from "../../config/api";

export default function PatientAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Updated state to include profileImage
  const [formData, setFormData] = useState({ 
    fullname: "", 
    email: "", 
    password: "",
    profileImage: null 
  });
  
  const navigate = useNavigate();

  const handleAction = async () => {
    // --- 1. LOGIN LOGIC ---
    if (!isSignUp) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/patient/login`, {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userFullname", response.data.fullname || "Patient User");
        localStorage.setItem("userRole", "Patient");
        // Save profile image path if returned by backend
        localStorage.setItem("userAvatar", response.data.profileImagePath || "");

        alert("Access Granted to HealthChain Node");
        navigate('/patient/dashboard');
      } catch (err) {
        alert("Login failed: " + (err.response?.data || "Server unreachable"));
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP + BLOCKCHAIN LOGIC ---
    if (!window.ethereum) {
      alert("MetaMask not found! Please install the MetaMask browser extension and refresh.");
      return;
    }

    setLoading(true);
    try {
      // 1. Explicitly prompt user to connect account in MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) {
        alert("Please connect an active account in MetaMask.");
        setLoading(false);
        return;
      }

      // 2. BrowserProvider with "any" network tolerance
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // 3. Request cryptographic signature
      let signature;
      try {
        signature = await signer.signMessage(`Registering Patient Node: ${formData.email}`);
      } catch (signErr) {
        if (
          signErr.code === 4001 || 
          signErr.info?.error?.code === 4001 || 
          signErr.message?.toLowerCase().includes("user rejected")
        ) {
          alert("Signature rejected in MetaMask. Please approve the signature to initialize your patient account.");
          return;
        }
        if (
          signErr.code === "NETWORK_ERROR" || 
          signErr.message?.toLowerCase().includes("could not detect network") ||
          signErr.message?.toLowerCase().includes("network")
        ) {
          alert("MetaMask Network Error: MetaMask cannot connect to the currently selected network (such as offline Localhost 8545). Please switch MetaMask to Sepolia Testnet or Ethereum Mainnet.");
          return;
        }
        throw signErr;
      }

      // 4. Form data preparation
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("walletAddress", walletAddress);
      data.append("signature", signature);
      
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      // 5. Submit to backend API
      try {
        await axios.post(`${API_BASE_URL}/api/auth/patient/signup`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (apiErr) {
        if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
          alert(`Backend Server Offline: Cannot connect to ${API_BASE_URL}.\nPlease make sure the Spring Boot backend is running.`);
          return;
        }
        const serverMsg = apiErr.response?.data?.message || apiErr.response?.data || "Signup failed on backend";
        alert(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
        return;
      }

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userFullname", formData.fullname);
      localStorage.setItem("userRole", "Patient");

      alert(`Node Initialized Successfully!`);
      navigate('/patient/dashboard');

    } catch (err) {
      console.error("Initialization failed:", err);
      if (err.code === "NETWORK_ERROR" || err.message?.toLowerCase().includes("could not detect network")) {
        alert("MetaMask Network Error: Please ensure MetaMask is connected to an active network (e.g. Sepolia or Ethereum Mainnet).");
      } else {
        alert("Initialization Error: " + (err.message || "Unknown error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <motion.div 
        layout // Smooth transition when expanding for file upload
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[95vh]"
      >
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Selection
        </button>
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-teal-500/20 rounded-2xl mb-4 text-teal-400 border border-teal-500/20">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Patient {isSignUp ? "Initialization" : "Login"}
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
            Secure Decentralized Health Node
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {isSignUp && (
            <>
              <InputField 
                label="Full Legal Name" 
                placeholder="e.g. Jane Margaret Doe"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                icon={<UserIcon className="w-5 h-5" />} 
              />
              {/* Added the FileUpload for Profile Picture */}
              <FileUpload 
                label="Profile Picture (Optional)"
                hint="Used for on-chain identity (JPG/PNG)"
                onChange={(file) => setFormData({...formData, profileImage: file})}
              />
            </>
          )}

          <InputField 
            label="Network Email" 
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            type="email" 
            icon={<FingerPrintIcon className="w-5 h-5" />} 
          />
          <InputField 
            label="Secure Key" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            type="password" 
            icon={<ShieldCheckIcon className="w-5 h-5" />} 
          />
          
          <button 
            onClick={handleAction} 
            disabled={loading}
            className="w-full py-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-[10px] mt-4 disabled:opacity-50 shadow-xl shadow-teal-500/20 active:scale-[0.98]"
          >
            {loading ? "Anchoring to Blockchain..." : (isSignUp ? "Initialize Node" : "Access Portal")}
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          {isSignUp ? "Existing Patient?" : "New to the Network?"} 
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="ml-2 text-teal-400 hover:text-teal-300 underline underline-offset-8 transition-colors"
          >
            {isSignUp ? "Sign In" : "Join Now"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}