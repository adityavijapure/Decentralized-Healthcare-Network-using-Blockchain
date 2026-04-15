import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { 
  BuildingOffice2Icon, ArrowLeftIcon, CalendarIcon, 
  FingerPrintIcon, ShieldCheckIcon, DocumentCheckIcon 
} from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";

export default function HospitalAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State for all Hospital Data
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

  const handleAction = async () => {
    // --- 1. LOGIN LOGIC ---
    if (!isSignUp) {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8085/api/hospital/login", {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userFullname", res.data.hospitalName);
        localStorage.setItem("userRole", "Hospital");
        navigate('/hospital/dashboard');
      } catch (err) {
        alert("Institutional Access Denied: Check Admin Credentials.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP + BLOCKCHAIN LOGIC ---
    if (!window.ethereum) return alert("MetaMask required for Institutional Node Initialization.");
    if (!formData.regCert || !formData.isCompliant) {
      return alert("Registration certificate and Compliance agreement are mandatory.");
    }

    setLoading(true);
    try {
      // Step A: Blockchain Proof of Authority (PoA)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      
      const signature = await signer.signMessage(
        `HealthChain Hospital Node Auth: ${formData.hospitalName} (${formData.licenseNumber})`
      );

      // Step B: Multi-part Data Preparation
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("hospitalName", formData.hospitalName);
      data.append("estYear", formData.estYear);
      data.append("licenseNumber", formData.licenseNumber);
      data.append("councilReg", formData.councilReg);
      data.append("walletAddress", walletAddress);
      data.append("blockchainSignature", signature);
      
      // Uploading Files
      data.append("regCert", formData.regCert);
      if (formData.hospitalLogo) data.append("hospitalLogo", formData.hospitalLogo);

      // Step C: Send to Backend
      await axios.post("http://localhost:8085/api/hospital/signup", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userFullname", formData.hospitalName);
      
      alert("Institutional Node Initialized. Hospital Identity anchored to Blockchain.");
      navigate('/hospital/dashboard');

    } catch (err) {
      console.error(err);
      alert("Onboarding Failed: Verify License details and MetaMask connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT BRANDING PANEL */}
        <div className="lg:w-1/3 bg-gradient-to-br from-purple-600 to-violet-800 p-12 text-white flex flex-col justify-between">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold mb-10 uppercase tracking-widest">
              <ArrowLeftIcon className="w-4 h-4" /> Back to Network
            </button>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
              Hospital <br /> Lab <br /> 
              <span className="text-white/40 text-lg font-bold tracking-widest">Verification</span>
            </h2>
          </div>
          <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Protocol Status</p>
            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              NODE_INITIALIZATION_READY
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="flex-1 p-10 lg:p-14 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="md:col-span-2">
              <h3 className="text-white font-bold text-xl mb-1">{isSignUp ? "Institutional Onboarding" : "Portal Access"}</h3>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Secure Healthcare Gateway</p>
            </div>

            <InputField 
              label="Admin Email" 
              type="email" 
              icon={<FingerPrintIcon className="w-5 h-5"/>} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <InputField 
              label="Access Key" 
              type="password" 
              icon={<ShieldCheckIcon className="w-5 h-5"/>}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />

            {isSignUp && (
              <>
                <InputField label="Hospital Name" value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} icon={<BuildingOffice2Icon className="w-5 h-5"/>} />
                <InputField label="Establishment Year" value={formData.estYear} onChange={(e) => setFormData({...formData, estYear: e.target.value})} type="number" icon={<CalendarIcon className="w-5 h-5" />} />
                <InputField label="License Number" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} />
                <InputField label="Medical Council Registration" value={formData.councilReg} onChange={(e) => setFormData({...formData, councilReg: e.target.value})} />
                
                <div className="md:col-span-2 space-y-6 mt-4">
                  <FileUpload label="Government Registration (PDF/JPG)" onChange={(file) => setFormData({...formData, regCert: file})} />
                  <FileUpload label="Hospital Logo" onChange={(file) => setFormData({...formData, hospitalLogo: file})} />
                  
                  <label className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 cursor-pointer hover:bg-purple-500/20 transition-all">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-purple-600" 
                      checked={formData.isCompliant}
                      onChange={(e) => setFormData({...formData, isCompliant: e.target.checked})}
                    />
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Compliance Agreement & Data Privacy Signed</span>
                  </label>
                </div>
              </>
            )}

            <button 
              onClick={handleAction} 
              disabled={loading}
              className="md:col-span-2 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-[10px] mt-4 disabled:opacity-50"
            >
              {loading ? "Anchoring to Blockchain..." : (isSignUp ? "Initialize Hospital Node" : "Access Portal")}
            </button>
          </form>

          <button onClick={() => setIsSignUp(!isSignUp)} className="mt-8 w-full text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
            {isSignUp ? "Return to Sign In" : "Register New Institution"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}