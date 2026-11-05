import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Building2, 
  ArrowLeft, 
  Calendar, 
  Fingerprint, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Stethoscope, 
  User, 
  KeyRound, 
  ArrowRight, 
  FileBadge,
  Database
} from "lucide-react";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";
import AuthStatusDialog from "../../components/auth/AuthStatusDialog";
import { API_BASE_URL, setAuthToken } from "../../config/api";

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

  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    actionText: ""
  });

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
    // --- 1. HOSPITAL LOGIN (DATABASE + JWT) ---
    if (!isSignUp) {
      if (!formData.email.trim() || !formData.password.trim()) {
        setDialog({
          isOpen: true,
          type: "error",
          title: "Missing Administrator Credentials",
          message: "Please enter your registered institution email and password.",
          actionText: "Try Again"
        });
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/hospital/login`, {
          email: formData.email.trim(),
          password: formData.password
        });
        
        const data = res.data;
        if (data.token) {
          setAuthToken(data.token);
        }
        localStorage.setItem("userEmail", data.email || formData.email.trim());
        localStorage.setItem("userFullname", data.hospitalName || "Hospital Facility");
        localStorage.setItem("userRole", "Hospital");
        if (data.logo) localStorage.setItem("hospitalLogo", data.logo); 

        setDialog({
          isOpen: true,
          type: "success",
          title: "Hospital Login Successful!",
          message: `Welcome back, ${data.hospitalName || "Institution Admin"}! Your facility JWT token has been verified. Redirecting to diagnostic lab management...`,
          actionText: "Entering Console"
        });

        setTimeout(() => {
          navigate('/hospital/dashboard');
        }, 1300);

      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || "Check Credentials or verify backend is online.";
        setDialog({
          isOpen: true,
          type: "error",
          title: "Institutional Access Denied",
          message: typeof msg === "string" ? msg : "Failed to authenticate hospital account.",
          actionText: "Dismiss"
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. HOSPITAL SIGNUP (STORED IN DATABASE) ---
    if (!formData.email.trim() || !formData.password.trim() || !formData.hospitalName.trim() || !formData.licenseNumber.trim()) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Required Information Missing",
        message: "Please fill in the hospital name, administrative email, password, and clinical license number.",
        actionText: "Complete Form"
      });
      return;
    }

    if (!formData.regCert) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Clinical License Required",
        message: "Official Government Registration Certificate is mandatory for clinical onboarding.",
        actionText: "Upload Certificate"
      });
      return;
    }
    if (!formData.isCompliant) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Policy Agreement Required",
        message: "Please agree to the institutional verification and clinical data compliance policy.",
        actionText: "Confirm Policy"
      });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("hospitalName", formData.hospitalName.trim());
      data.append("estYear", formData.estYear || "2000");
      data.append("licenseNumber", formData.licenseNumber.trim());
      data.append("councilReg", formData.councilReg || "State Clinical Registry");
      data.append("regCert", formData.regCert);
      if (formData.hospitalLogo) data.append("hospitalLogo", formData.hospitalLogo);

      await axios.post(`${API_BASE_URL}/api/hospital/signup`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Automatically authenticate to obtain JWT token
      const loginRes = await axios.post(`${API_BASE_URL}/api/hospital/login`, {
        email: formData.email.trim(),
        password: formData.password
      });

      if (loginRes.data.token) {
        setAuthToken(loginRes.data.token);
      }
      localStorage.setItem("userEmail", formData.email.trim());
      localStorage.setItem("userFullname", formData.hospitalName.trim());
      localStorage.setItem("userRole", "Hospital");

      setDialog({
        isOpen: true,
        type: "success",
        title: "Institution Registered Successfully!",
        message: `Welcome to HealthChain! ${formData.hospitalName.trim()} has been registered and verified in Neon PostgreSQL. Entering management dashboard...`,
        actionText: "Entering Console"
      });

      setTimeout(() => {
        navigate('/hospital/dashboard');
      }, 1500);

    } catch (apiErr) {
      let serverMsg = "Onboarding failed on database. Please verify backend is running.";
      if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
        serverMsg = `Backend Server Offline: Cannot connect to ${API_BASE_URL}.`;
      } else if (apiErr.response?.data?.message) {
        serverMsg = apiErr.response.data.message;
      } else if (typeof apiErr.response?.data === "string") {
        serverMsg = apiErr.response.data;
      }

      setDialog({
        isOpen: true,
        type: "error",
        title: "Institutional Registration Error",
        message: serverMsg,
        actionText: "Review Details"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans selection:bg-purple-500/30">
      
      {/* Animated Dialog Box */}
      <AuthStatusDialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        role="Hospital"
        actionText={dialog.actionText}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
      />

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
                <span>JWT Institutional Security</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Hospital & <br />
                <span className="text-purple-200">Diagnostic</span> <br />
                Laboratory
              </h2>

              <p className="text-xs text-purple-100/90 mt-4 leading-relaxed">
                Connect clinical labs, diagnostic imaging centers, and hospitals. Authenticate patients on arrival, manage official reports, and store records securely in our cloud database.
              </p>

              {/* Benefit Bullets */}
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Stateless JWT Bearer Token Security</span>
                </div>
                <div className="flex items-center gap-2.5 text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Encrypted Hospital Certificate Storage</span>
                </div>
                <div className="flex items-center gap-2.5 text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>BCrypt Salted Password Protection</span>
                </div>
              </div>
            </div>

            {/* Database Status Pill */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Database className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    Database Verified
                  </p>
                  <p className="text-xs font-semibold text-white truncate">
                    Neon PostgreSQL • JWT 256-bit
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
                {isSignUp ? "Institutional Onboarding" : "Hospital Portal Access"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? "Register clinical facility node with verified government license." 
                  : "Sign in with hospital admin credentials to receive a JWT session token."}
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
                  label="Password" 
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
                    Forgot password?
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
                          I verify that all uploaded institution documents are authentic and agree to standard health data compliance.
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
                  <span>Authenticating...</span>
                ) : isSignUp ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Register Hospital Facility</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Hospital Portal</span>
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
                {isSignUp ? "Already registered hospital? " : "Registering a new institution? "} 
                <span className="text-purple-400 underline font-bold ml-1">
                  {isSignUp ? "Sign In" : "Register Institution"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
