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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    licenseNumber: "",
    regYear: "",
    medicalCouncil: "",
    specialization: "",
    proofFile: null // This will hold the actual File object
  });

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setStep(1);
  };

  const handleAction = async () => {
    // --- 1. LOGIN LOGIC ---
    if (!isSignUp) {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8085/api/doctor/login", {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userFullname", res.data.fullname);
        localStorage.setItem("userSpecialization", res.data.specialization);
        localStorage.setItem("userRole", "Doctor");
        navigate('/doctor/dashboard');
      } catch (err) {
        alert("Login Failed: Check credentials.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP PROGRESSION ---
    if (step === 1) {
      setStep(2);
      return;
    }

    // --- 3. BLOCKCHAIN INITIALIZATION & MULTIPART UPLOAD ---
    if (!window.ethereum) return alert("MetaMask Required");
    if (!formData.proofFile) return alert("Please upload your professional photo proof.");

    setLoading(true);
    try {
      // Step A: Blockchain Identity Anchoring
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Create a cryptographic hash of the registration intent
      const blockchainMessage = `HealthChain Registration: License ${formData.licenseNumber} for ${formData.email}`;
      const signature = await signer.signMessage(blockchainMessage);

      // Step B: Multi-part Data Preparation (For Photo + Data)
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
      
      // CRITICAL: Ensure the file is appended correctly
      data.append("proofFile", formData.proofFile);

      // Step C: Post to backend (Saves to DB & Simulated Blockchain Node)
      const res = await axios.post("http://localhost:8085/api/doctor/signup", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userFullname", formData.fullname);
      localStorage.setItem("userSpecialization", formData.specialization);
      
      alert("Doctor Node Secured & Identity Uploaded to Blockchain!");
      navigate('/doctor/dashboard');

    } catch (err) {
      console.error(err);
      alert("Registration Error: Check your backend logs or MetaMask connection.");
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
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <h2 className="text-4xl font-black leading-tight mt-12 tracking-tighter">
              Verified <br /> Doctor <br /> 
              <span className="text-white/40 text-xl font-bold uppercase tracking-widest">Node</span>
            </h2>
          </div>
          <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Auth Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono opacity-80 text-white font-bold">READY_FOR_UPLOAD</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center min-h-[600px]">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {isSignUp ? (step === 1 ? "Initialize Account" : "Identity Proof") : "Welcome Back"}
              </h1>
            </header>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {(!isSignUp || (isSignUp && step === 1)) && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <InputField label="Network Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={<FingerPrintIcon className="w-5 h-5" />} />
                    <InputField label="Secure Key" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} icon={<ShieldCheckIcon className="w-5 h-5" />} />
                    {isSignUp && (
                      <InputField label="Full Legal Name" value={formData.fullname} onChange={(e) => setFormData({...formData, fullname: e.target.value})} icon={<UserIcon className="w-5 h-5" />} />
                    )}
                  </motion.div>
                )}

                {isSignUp && step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="License #" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} icon={<IdentificationIcon className="w-5 h-5" />} />
                      <InputField label="Reg. Year" type="number" value={formData.regYear} onChange={(e) => setFormData({...formData, regYear: e.target.value})} />
                    </div>
                    <InputField label="Specialization" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} icon={<AcademicCapIcon className="w-5 h-5" />} />
                    
                    {/* PHOTO UPLOAD BINDING */}
                    <FileUpload 
                      label="Verification Photo Proof" 
                      onChange={(file) => setFormData({...formData, proofFile: file})} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-4">
                {isSignUp && step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                    Back
                  </button>
                )}
                <button 
                  onClick={handleAction} 
                  disabled={loading}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[10px]"
                >
                  {loading ? "Anchoring Data..." : (isSignUp ? (step === 1 ? "Next Protocol" : "Initialize Node") : "Authorize Access")}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <button type="button" onClick={toggleMode} className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {isSignUp ? "Already registered? " : "New Doctor? "} 
                <span className="text-blue-400"> {isSignUp ? "Sign In" : "Join Network"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}