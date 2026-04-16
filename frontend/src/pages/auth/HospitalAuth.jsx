import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { 
  BuildingOffice2Icon, ArrowLeftIcon, CalendarIcon, 
  FingerPrintIcon, ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";

export default function HospitalAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ 
      ...formData, 
      regCert: null, 
      hospitalLogo: null, 
      isCompliant: false 
    });
  };

  const handleAction = async () => {
    if (!isSignUp) {
      if (!formData.email || !formData.password) return alert("Please enter credentials.");
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8085/api/hospital/login", {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userFullname", res.data.hospitalName);
        localStorage.setItem("userRole", "Hospital");
        localStorage.setItem("hospitalLogo", res.data.logo); 

        navigate('/hospital/dashboard');
      } catch (err) {
        alert("Access Denied: " + (err.response?.data || "Check Credentials"));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!formData.regCert) return alert("STRICT REQUIREMENT: Government Registration Certificate is missing.");
    if (!formData.isCompliant) return alert("LEGAL REQUIREMENT: You must agree to the Compliance Policy.");
    if (!window.ethereum) return alert("MetaMask required to anchor Institutional Node Identity.");

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      
      const signature = await signer.signMessage(
        `HealthChain Institutional Authorization:\nInstitution: ${formData.hospitalName}\nLicense: ${formData.licenseNumber}\nAdmin: ${formData.email}`
      );

      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("hospitalName", formData.hospitalName);
      data.append("estYear", formData.estYear);
      data.append("licenseNumber", formData.licenseNumber);
      data.append("councilReg", formData.councilReg);
      data.append("walletAddress", walletAddress);
      data.append("blockchainSignature", signature);
      data.append("regCert", formData.regCert);
      if (formData.hospitalLogo) data.append("hospitalLogo", formData.hospitalLogo);

      await axios.post("http://localhost:8085/api/hospital/signup", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userFullname", formData.hospitalName);
      localStorage.setItem("userRole", "Hospital");

      alert("Institutional Node successfully active on Blockchain.");
      navigate('/hospital/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Onboarding failed. Verify your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <motion.div layout className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT BRANDING PANEL */}
        <div className="lg:w-1/3 bg-gradient-to-br from-purple-600 to-violet-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold mb-10 uppercase tracking-widest">
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
              Hospital <br /> Lab <br /> 
              <span className="text-white/40 text-lg font-bold tracking-widest">Node Setup</span>
            </h2>
          </div>
          <div className="z-10 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Network Status</p>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              BLOCKCHAIN_READY
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="flex-1 p-10 lg:p-14 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="md:col-span-2">
              <h3 className="text-white font-bold text-2xl mb-1">{isSignUp ? "Institutional Onboarding" : "Portal Access"}</h3>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest italic">Verification via Proof-of-Authority Signature</p>
            </div>

            <InputField 
              label="Admin Email" 
              placeholder="e.g. admin@city-hospital.org"
              helperText="Official email used for node management."
              icon={<FingerPrintIcon className="w-5 h-5 text-purple-400"/>} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <InputField 
              label="Access Key" 
              type="password"
              placeholder="••••••••"
              helperText="Decryption key for your hospital's data node."
              icon={<ShieldCheckIcon className="w-5 h-5 text-purple-400"/>}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />

            <AnimatePresence>
              {isSignUp && (
                <>
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="md:col-span-1">
                    <InputField 
                      label="Hospital Name" 
                      placeholder="e.g. City General Hospital"
                      icon={<BuildingOffice2Icon className="w-5 h-5 text-purple-400"/>}
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    />
                  </motion.div>
                  
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="md:col-span-1">
                    <InputField 
                      label="Est. Year" 
                      type="number"
                      placeholder="e.g. 1995"
                      icon={<CalendarIcon className="w-5 h-5 text-purple-400" />} 
                      value={formData.estYear}
                      onChange={(e) => setFormData({...formData, estYear: e.target.value})}
                    />
                  </motion.div>

                  <InputField 
                    label="License Number" 
                    placeholder="e.g. HOSP-REG-10293"
                    helperText="Official registration ID."
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  />
                  
                  <InputField 
                    label="Medical Council Reg" 
                    placeholder="e.g. NMC-2026-AB"
                    helperText="Active council registration."
                    value={formData.councilReg}
                    onChange={(e) => setFormData({...formData, councilReg: e.target.value})}
                  />
                  
                  <div className="md:col-span-2 space-y-6 mt-4">
                    {/* The Issue Fix is here: updating state properly */}
                    <FileUpload 
                      label="Gov. Registration Certificate (PDF/JPG)" 
                      hint="Upload active clinical license (Mandatory)"
                      onChange={(file) => setFormData(prev => ({...prev, regCert: file}))} 
                    />
                    
                    <FileUpload 
                      label="Hospital Logo (Optional)" 
                      hint="PNG/JPG for patient reports"
                      onChange={(file) => setFormData(prev => ({...prev, hospitalLogo: file}))} 
                    />
                    
                    <label className="flex items-center gap-4 p-5 bg-purple-500/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-purple-500/10 transition-all">
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 accent-purple-600 rounded-lg cursor-pointer" 
                        checked={formData.isCompliant}
                        onChange={(e) => setFormData({...formData, isCompliant: e.target.checked})}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        I verify all documents are authentic and agree to the <span className="text-purple-400 underline">Blockchain Compliance Policy</span>.
                      </span>
                    </label>
                  </div>
                </>
              )}
            </AnimatePresence>

            <button 
              onClick={handleAction} 
              disabled={loading}
              className="md:col-span-2 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.25em] text-[10px] mt-6 disabled:opacity-50"
            >
              {loading ? "Anchoring Node..." : (isSignUp ? "Initialize Hospital Node" : "Access Portal")}
            </button>
          </form>

          <button 
            onClick={toggleMode} 
            className="mt-10 w-full text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
          >
            {isSignUp ? "Already Registered? Sign In" : "Register New Institution"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}