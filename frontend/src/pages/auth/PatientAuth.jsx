import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { 
  User, 
  ShieldCheck, 
  Fingerprint, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Wallet,
  AlertCircle,
  Stethoscope,
  Building2,
  FileText,
  KeyRound,
  ArrowRight
} from "lucide-react";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";
import { API_BASE_URL } from "../../config/api";

export default function PatientAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [walletConnected, setWalletConnected] = useState("");
  
  const [formData, setFormData] = useState({ 
    fullname: "", 
    email: "", 
    password: "",
    profileImage: null 
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setHasMetaMask(true);
      window.ethereum.request({ method: "eth_accounts" })
        .then(accounts => {
          if (accounts && accounts.length > 0) {
            setWalletConnected(accounts[0]);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleAction = async () => {
    // --- 1. LOGIN LOGIC ---
    if (!isSignUp) {
      if (!formData.email.trim() || !formData.password.trim()) {
        return alert("Please enter your registered email and password.");
      }
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/patient/login`, {
          email: formData.email.trim(),
          password: formData.password
        });

        localStorage.setItem("userEmail", formData.email.trim());
        localStorage.setItem("userFullname", response.data.fullname || "Patient User");
        localStorage.setItem("userRole", "Patient");
        localStorage.setItem("userAvatar", response.data.profileImagePath || "");

        navigate('/patient/dashboard');
      } catch (err) {
        alert("Login failed: " + (err.response?.data || "Invalid credentials or backend offline."));
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP + BLOCKCHAIN LOGIC ---
    if (!formData.fullname.trim() || !formData.email.trim() || !formData.password.trim()) {
      return alert("Please fill in your name, email, and password.");
    }

    if (!window.ethereum) {
      alert("MetaMask extension is required to anchor a decentralized patient identity on Ethereum. Please install MetaMask and try again.");
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) {
        alert("Please connect an active account in MetaMask.");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      setWalletConnected(walletAddress);

      let signature;
      try {
        signature = await signer.signMessage(`Registering Patient Node: ${formData.email.trim()}`);
      } catch (signErr) {
        if (
          signErr.code === 4001 || 
          signErr.info?.error?.code === 4001 || 
          signErr.message?.toLowerCase().includes("user rejected")
        ) {
          alert("Signature rejected in MetaMask. Please approve the signature to initialize your patient account.");
          return;
        }
        alert("MetaMask Signature Error: " + (signErr.message || "Approval cancelled."));
        return;
      }

      const data = new FormData();
      data.append("fullname", formData.fullname.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("walletAddress", walletAddress);
      data.append("signature", signature);
      
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

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

      localStorage.setItem("userEmail", formData.email.trim());
      localStorage.setItem("userFullname", formData.fullname.trim());
      localStorage.setItem("userRole", "Patient");

      navigate('/patient/dashboard');

    } catch (err) {
      console.error("Initialization failed:", err);
      alert("Initialization Error: " + (err.message || "Unknown error occurred."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans selection:bg-teal-500/30">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="cyber-glow w-[550px] h-[550px] bg-teal-500/15 top-[-10%] left-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-blue-600/15 bottom-[-10%] right-[-10%]" />

      <div className="relative z-10 w-full max-w-4xl">
        
        {/* Top Bar: Back Link & Role Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Portals</span>
          </Link>

          {/* Quick Role Switcher Pill Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-xl">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </span>
            <Link
              to="/auth/doctor"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </Link>
            <Link
              to="/auth/hospital"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital</span>
            </Link>
          </div>
        </div>

        {/* Auth Main Card */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="rounded-[2.5rem] bg-slate-900/70 border border-teal-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Visual Panel */}
          <div className="md:w-5/12 bg-gradient-to-br from-teal-700 via-emerald-800 to-slate-950 p-8 lg:p-10 flex flex-col justify-between text-white relative">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-200 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Self-Sovereign Identity</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Patient <br />
                <span className="text-teal-200">Health Record</span> <br />
                Portal
              </h2>

              <p className="text-xs text-teal-100/90 mt-4 leading-relaxed">
                Take full control of your lifetime diagnostic records. Grant instant, secure access to verified physicians and revoke permissions anytime via smart contracts.
              </p>

              {/* Benefit Bullets */}
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>AES-256 Encrypted Cloud Storage</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Permanent Blockchain Audit History</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Zero Data Selling or Tracking</span>
                </div>
              </div>
            </div>

            {/* MetaMask Status Pill */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className={`p-2 rounded-xl ${hasMetaMask ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    {hasMetaMask ? "MetaMask Detected" : "Browser Wallet Notice"}
                  </p>
                  <p className="text-xs font-semibold text-white truncate">
                    {walletConnected 
                      ? `${walletConnected.slice(0, 6)}...${walletConnected.slice(-4)}`
                      : hasMetaMask 
                        ? "Ready for On-Chain Signing" 
                        : "Extension recommended for Signup"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
            
            {/* Segmented Sign In vs Sign Up Switcher */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 mb-8">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isSignUp
                    ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSignUp
                    ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Node</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? "Register Patient Node" : "Welcome Back"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? "Enter your credentials to anchor your patient identity onto the ledger." 
                  : "Sign in with your verified credentials to access medical records."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <InputField 
                      label="Full Legal Name" 
                      placeholder="e.g. Jane Margaret Doe"
                      value={formData.fullname}
                      onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                      icon={<User className="w-4 h-4" />} 
                      required
                    />

                    <FileUpload 
                      label="Profile Picture (Optional)"
                      hint="JPG/PNG for identity verification"
                      onChange={(file) => setFormData({...formData, profileImage: file})}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputField 
                label="Registered Email" 
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email" 
                icon={<Fingerprint className="w-4 h-4" />} 
                required
              />

              <InputField 
                label="Secure Access Key / Password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                type="password" 
                icon={<Lock className="w-4 h-4" />} 
                helperText={isSignUp ? "Minimum 6 characters" : ""}
                required
              />

              {!isSignUp && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300">
                    <input type="checkbox" className="w-4 h-4 rounded accent-teal-500 bg-slate-900 border-white/10" />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-teal-400 hover:text-teal-300 cursor-pointer font-medium">
                    Lost key?
                  </span>
                </div>
              )}

              {isSignUp && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[11px] leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Node initialization prompts a free MetaMask signature verification to prove Ethereum identity.</span>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl transition-all uppercase tracking-wider text-xs shadow-xl shadow-teal-500/25 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Anchoring to Network...</span>
                ) : isSignUp ? (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Initialize Patient Node</span>
                  </>
                ) : (
                  <>
                    <span>Access Patient Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {isSignUp ? "Already anchored on HealthChain? " : "New to the decentralized network? "}
                <span className="text-teal-400 font-bold underline ml-1">
                  {isSignUp ? "Sign In" : "Register Node"}
                </span>
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
