import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { 
  UserIcon, AcademicCapIcon, IdentificationIcon, 
  ArrowLeftIcon, FingerPrintIcon, ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";

export default function DoctorAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Integrated state for registration and login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    licenseNumber: "",
    regYear: "",
    medicalCouncil: "",
    specialization: "",
    proofFile: null // This now correctly binds to the File object from FileUpload
  });

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setStep(1);
    // Reset file and metadata on toggle to prevent stale data
    setFormData(prev => ({ ...prev, proofFile: null }));
  };

  const handleAction = async () => {
    // --- 1. LOGIN LOGIC ---
    if (!isSignUp) {
      if (!formData.email || !formData.password) return alert("Credentials required.");
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8085/api/doctor/login", {
          email: formData.email,
          password: formData.password
        });
        
        // Match the Map keys from your Spring Boot Controller
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userFullname", res.data.fullname);
        localStorage.setItem("userSpecialization", res.data.specialization);
        localStorage.setItem("userRole", "Doctor");

        navigate('/doctor/dashboard');
      } catch (err) {
        alert("Login Failed: " + (err.response?.data || "Check Credentials"));
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP PROGRESSION ---
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.fullname) {
        return alert("Please complete account details.");
      }
      setStep(2);
      return;
    }

    // --- 3. BLOCKCHAIN & MULTIPART UPLOAD ---
    if (!window.ethereum) return alert("MetaMask Required for Node Identity");
    if (!formData.proofFile) return alert("Professional proof document is mandatory.");

    setLoading(true);
    try {
      // Step A: Blockchain Signature (Proof of Authority)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      const message = `HealthChain Doctor Registration\nLicense: ${formData.licenseNumber}\nNode: ${formData.email}`;
      const signature = await signer.signMessage(message);

      // Step B: Multi-part Preparation
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("fullname", formData.fullname);
      data.append("licenseNumber", formData.licenseNumber);
      data.append("regYear", formData.regYear);
      data.append("medicalCouncil", formData.medicalCouncil);
      data.append("specialization", formData.specialization);
      data.append("walletAddress", walletAddress);
      data.append("blockchainSignature", signature);
      
      // Binary File
      data.append("proofFile", formData.proofFile);

      // Step C: Transmission to Spring Boot Node
      await axios.post("http://localhost:8085/api/doctor/signup", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userFullname", formData.fullname);
      localStorage.setItem("userSpecialization", formData.specialization);
      localStorage.setItem("userRole", "Doctor");

      alert("Node Initialized and Secured on Blockchain!");
      navigate('/doctor/dashboard');

    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Signup Error: Ensure MetaMask is connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 lg:p-6 font-sans">
      <motion.div layout className="relative w-full max-w-5xl bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* LEFT PANEL */}
        <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex flex-col justify-between text-white">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
              <ArrowLeftIcon className="w-4 h-4" /> Back to Selection
            </button>
            <h2 className="text-4xl font-black leading-tight mt-12 tracking-tighter">
              Doctor <br /> Node <br /> 
              <span className="text-white/40 text-xl font-bold uppercase tracking-widest leading-none">Authorization</span>
            </h2>
          </div>
          <div className="bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Network Protocol</p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTH_NODE_ACTIVE
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 lg:p-14 flex flex-col justify-center min-h-[600px]">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {isSignUp ? (step === 1 ? "Create Account" : "Medical Credentials") : "Doctor Access"}
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                {isSignUp ? `Step ${step} of 2` : "Verify credentials to decrypt records"}
              </p>
            </header>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {(!isSignUp || (isSignUp && step === 1)) && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <InputField 
                      label="Network Email" 
                      placeholder="dr.name@healthchain.io"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      icon={<FingerPrintIcon className="w-5 h-5 text-blue-400" />} 
                    />
                    <InputField 
                      label="Secure Key" 
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      icon={<ShieldCheckIcon className="w-5 h-5 text-blue-400" />} 
                    />
                    {isSignUp && (
                      <InputField 
                        label="Full Legal Name" 
                        placeholder="Dr. Alexander Pierce"
                        value={formData.fullname} 
                        onChange={(e) => setFormData({...formData, fullname: e.target.value})} 
                        icon={<UserIcon className="w-5 h-5 text-blue-400" />} 
                      />
                    )}
                  </motion.div>
                )}

                {isSignUp && step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="License #" placeholder="MD-8821" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} icon={<IdentificationIcon className="w-5 h-5 text-blue-400" />} />
                      <InputField label="Reg. Year" type="number" placeholder="2020" value={formData.regYear} onChange={(e) => setFormData({...formData, regYear: e.target.value})} />
                    </div>
                    <InputField label="Specialization" placeholder="Cardiologist" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} icon={<AcademicCapIcon className="w-5 h-5 text-blue-400" />} />
                    
                    <FileUpload 
                      label="Verification Photo Proof" 
                      hint="Medical Degree or Institutional ID (PDF/JPG)"
                      onChange={(file) => setFormData(prev => ({...prev, proofFile: file}))} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-6">
                {isSignUp && step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">
                    Back
                  </button>
                )}
                <button 
                  onClick={handleAction} 
                  disabled={loading}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all uppercase tracking-[0.2em] text-[10px]"
                >
                  {loading ? "Anchoring..." : (isSignUp ? (step === 1 ? "Next Protocol" : "Initialize Node") : "Authorize Access")}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <button type="button" onClick={toggleMode} className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                {isSignUp ? "Registered Doctor? " : "New Practitioner? "} 
                <span className="text-blue-400 underline underline-offset-8"> {isSignUp ? "Sign In" : "Join Network"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}