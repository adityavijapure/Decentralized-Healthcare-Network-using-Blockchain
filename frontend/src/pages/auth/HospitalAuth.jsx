import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { 
  Building2, 
  ArrowLeft, 
  Calendar, 
  Fingerprint, 
  Lock, 
  ShieldCheck, 
  FileCheck2, 
  Sparkles,
  Wallet,
  CheckCircle2,
  Stethoscope,
  User,
  KeyRound,
  ArrowRight,
  FileBadge
} from "lucide-react";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";
import { API_BASE_URL } from "../../config/api";

export default function HospitalAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [walletConnected, setWalletConnected] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    hospitalName: "",
    estYear: "",
    licenseNumber: "",
    councilReg: "",
    regCert: null,
    hospitalLogo: null,
    isCompliant: false
  });

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

  const toggleMode = (signUp) => {
    setIsSignUp(signUp);
    setFormData(prev => ({ 
      ...prev, 
      regCert: null, 
      hospitalLogo: null, 
      isCompliant: false 
    }));
  };

  const handleAction = async () => {
    if (!isSignUp) {
      if (!formData.email.trim() || !formData.password.trim()) {
        return alert("Please enter both admin email and password.");
      }
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/hospital/login`, {
          email: formData.email.trim(),
          password: formData.password
        });
        
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userFullname", res.data.hospitalName);
        localStorage.setItem("userRole", "Hospital");
        localStorage.setItem("hospitalLogo", res.data.logo); 

        navigate('/hospital/dashboard');
      } catch (err) {
        alert("Access Denied: " + (err.response?.data || "Check Credentials or verify backend is online."));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!formData.email.trim() || !formData.password.trim() || !formData.hospitalName.trim() || !formData.licenseNumber.trim()) {
      return alert("Please fill in the required hospital information.");
    }

    if (!formData.regCert) {
      return alert("STRICT REQUIREMENT: Government Registration Certificate is missing.");
    }
    if (!formData.isCompliant) {
      return alert("LEGAL REQUIREMENT: You must agree to the Blockchain Compliance Policy.");
    }
    if (!window.ethereum) {
      return alert("MetaMask is required to anchor Institutional Node Identity.");
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
        signature = await signer.signMessage(
          `HealthChain Institutional Authorization:\nInstitution: ${formData.hospitalName.trim()}\nLicense: ${formData.licenseNumber.trim()}\nAdmin: ${formData.email.trim()}`
        );
      } catch (signErr) {
        if (
          signErr.code === 4001 || 
          signErr.info?.error?.code === 4001 || 
          signErr.message?.toLowerCase().includes("user rejected")
        ) {
          alert("Signature rejected in MetaMask. Please approve the signature to initialize your institutional account.");
          return;
        }
        alert("MetaMask Error: " + (signErr.message || "Signing failed."));
        return;
      }

      const data = new FormData();
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("hospitalName", formData.hospitalName.trim());
      data.append("estYear", formData.estYear || "2000");
      data.append("licenseNumber", formData.licenseNumber.trim());
      data.append("councilReg", formData.councilReg || "State Clinical Registry");
      data.append("walletAddress", walletAddress);
      data.append("blockchainSignature", signature);
      data.append("regCert", formData.regCert);
      if (formData.hospitalLogo) data.append("hospitalLogo", formData.hospitalLogo);

      try {
        await axios.post(`${API_BASE_URL}/api/hospital/signup`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (apiErr) {
        if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
          alert(`Backend Server Offline: Cannot connect to ${API_BASE_URL}.\nPlease make sure the Spring Boot backend is running.`);
          return;
        }
        const serverMsg = apiErr.response?.data?.message || apiErr.response?.data || "Onboarding failed on backend";
        alert(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
        return;
      }

      localStorage.setItem("userEmail", formData.email.trim());
      localStorage.setItem("userFullname", formData.hospitalName.trim());
      localStorage.setItem("userRole", "Hospital");

      navigate('/hospital/dashboard');
    } catch (err) {
      console.error(err);
      alert("Hospital Node Error: " + (err.message || "Verify your connection."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans selection:bg-purple-500/30">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="cyber-glow w-[550px] h-[550px] bg-purple-600/20 top-[-10%] right-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-violet-600/15 bottom-[-10%] left-[-10%]" />

      <div className="relative z-10 w-full max-w-5xl">
        
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
            <Link
              to="/auth/patient"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </Link>
            <Link
              to="/auth/doctor"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </Link>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital</span>
            </span>
          </div>
        </div>

        {/* Auth Main Card */}
        <motion.div 
          layout 
          className="rounded-[2.5rem] bg-slate-900/70 border border-purple-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Left Visual Panel */}
          <div className="lg:w-4/12 bg-gradient-to-br from-purple-700 via-violet-800 to-slate-950 p-8 lg:p-10 text-white flex flex-col justify-between relative">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-400/30 text-purple-200 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Institutional Authority Node</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Hospital & <br />
                <span className="text-purple-200">Diagnostic</span> <br />
                Laboratory
              </h2>

              <p className="text-xs text-purple-100/90 mt-4 leading-relaxed">
                Connect clinical labs, imaging centers, and hospitals. Authenticate patients on arrival, mint verifiable diagnostic hashes, and upload securely to AWS S3.
              </p>

              {/* Benefit Bullets */}
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Direct Encrypted S3 Bucket Uploads</span>
                </div>
                <div className="flex items-center gap-2.5 text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Proof-of-Authority Report Minting</span>
                </div>
                <div className="flex items-center gap-2.5 text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Immediate Patient Identity Verification</span>
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
                    {hasMetaMask ? "MetaMask Active" : "Web3 Identity Notice"}
                  </p>
                  <p className="text-xs font-semibold text-white truncate">
                    {walletConnected 
                      ? `${walletConnected.slice(0, 6)}...${walletConnected.slice(-4)}`
                      : hasMetaMask 
                        ? "Ready for Institutional Anchor" 
                        : "MetaMask recommended for setup"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="flex-1 p-8 lg:p-12 max-h-[85vh] overflow-y-auto">
            
            {/* Segmented Sign In vs Sign Up Switcher */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isSignUp
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Hospital Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSignUp
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register Institution</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? "Institutional Onboarding" : "Portal Access"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? "Register clinical facility node with verified government license." 
                  : "Sign in with hospital admin credentials to upload reports."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Administrator Email" 
                  placeholder="admin@city-hospital.org"
                  type="email"
                  icon={<Fingerprint className="w-4 h-4 text-purple-400"/>} 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                
                <InputField 
                  label="Decryption Access Key" 
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4 text-purple-400"/>}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300">
                    <input type="checkbox" className="w-4 h-4 rounded accent-purple-600 bg-slate-900 border-white/10" />
                    <span>Remember hospital console</span>
                  </label>
                  <span className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium">
                    Reset node key
                  </span>
                </div>
              )}

              <AnimatePresence>
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden pt-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Institution Name" 
                        placeholder="e.g. City General Hospital"
                        icon={<Building2 className="w-4 h-4 text-purple-400"/>}
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                        required
                      />

                      <InputField 
                        label="Est. Year" 
                        type="number"
                        placeholder="e.g. 1995"
                        icon={<Calendar className="w-4 h-4 text-purple-400" />} 
                        value={formData.estYear}
                        onChange={(e) => setFormData({...formData, estYear: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Clinical License #" 
                        placeholder="e.g. HOSP-REG-10293"
                        icon={<FileBadge className="w-4 h-4 text-purple-400"/>}
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        required
                      />
                      
                      <InputField 
                        label="Medical Council Reg" 
                        placeholder="e.g. NMC-2026-AB"
                        value={formData.councilReg}
                        onChange={(e) => setFormData({...formData, councilReg: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <FileUpload 
                        label="Government Registration Certificate" 
                        hint="Active clinical license (PDF/JPG)"
                        onChange={(file) => setFormData(prev => ({...prev, regCert: file}))} 
                        required
                      />
                      
                      <FileUpload 
                        label="Hospital / Lab Logo (Optional)" 
                        hint="Branding for patient report digests (PNG/JPG)"
                        onChange={(file) => setFormData(prev => ({...prev, hospitalLogo: file}))} 
                      />
                      
                      <label className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 cursor-pointer hover:bg-purple-500/15 transition-all text-left">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 mt-0.5 accent-purple-600 rounded cursor-pointer" 
                          checked={formData.isCompliant}
                          onChange={(e) => setFormData({...formData, isCompliant: e.target.checked})}
                        />
                        <span className="text-xs text-slate-300 font-medium leading-relaxed">
                          I verify that all uploaded documents are authentic and agree to the <span className="text-purple-400 underline font-semibold">HealthChain Protocol Compliance Policy</span>.
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-black rounded-xl shadow-xl shadow-purple-600/25 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span>Anchoring Institutional Node...</span>
                ) : isSignUp ? (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Initialize Hospital Node</span>
                  </>
                ) : (
                  <>
                    <span>Access Hospital Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <button 
                type="button" 
                onClick={() => toggleMode(!isSignUp)} 
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {isSignUp ? "Already registered hospital node? " : "Registering a new institution? "} 
                <span className="text-purple-400 underline font-bold ml-1">
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
