import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  User, 
  ShieldCheck, 
  Fingerprint, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Database,
  KeyRound,
  ArrowRight,
  Stethoscope,
  Building2
} from "lucide-react";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";
import { API_BASE_URL, setAuthToken } from "../../config/api";

export default function PatientAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    fullname: "", 
    email: "", 
    password: "",
    profileImage: null 
  });
  
  const navigate = useNavigate();

  const handleAction = async () => {
    // --- 1. LOGIN LOGIC (DATABASE + JWT) ---
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

        const data = response.data;
        // Store JWT Token & User State
        if (data.token) {
          setAuthToken(data.token);
        }
        localStorage.setItem("userEmail", data.email || formData.email.trim());
        localStorage.setItem("userFullname", data.fullname || "Patient User");
        localStorage.setItem("userRole", "Patient");
        localStorage.setItem("userAvatar", data.profileImagePath || "");

        navigate('/patient/dashboard');
      } catch (err) {
        alert("Login failed: " + (err.response?.data?.message || err.response?.data || "Invalid credentials or backend offline."));
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP LOGIC (STORED IN DATABASE) ---
    if (!formData.fullname.trim() || !formData.email.trim() || !formData.password.trim()) {
      return alert("Please fill in your name, email, and password.");
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      await axios.post(`${API_BASE_URL}/api/auth/patient/signup`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Automatically authenticate to obtain JWT token
      const loginRes = await axios.post(`${API_BASE_URL}/api/auth/patient/login`, {
        email: formData.email.trim(),
        password: formData.password
      });

      if (loginRes.data.token) {
        setAuthToken(loginRes.data.token);
      }
      localStorage.setItem("userEmail", formData.email.trim());
      localStorage.setItem("userFullname", formData.fullname.trim());
      localStorage.setItem("userRole", "Patient");

      navigate('/patient/dashboard');

    } catch (apiErr) {
      if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
        alert(`Backend Server Offline: Cannot connect to ${API_BASE_URL}.\nPlease ensure the Spring Boot backend is running.`);
      } else {
        const serverMsg = apiErr.response?.data?.message || apiErr.response?.data || "Signup failed on database";
        alert(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
      }
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
                <span>JWT Secure Authentication</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Patient <br />
                <span className="text-teal-200">Health Record</span> <br />
                Portal
              </h2>

              <p className="text-xs text-teal-100/90 mt-4 leading-relaxed">
                Take full control of your lifetime diagnostic records. Account credentials are kept securely in our encrypted database with stateless JWT session authorization.
              </p>

              {/* Benefit Bullets */}
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Stateless JWT Bearer Token Security</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>BCrypt Salted Password Encryption</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Zero Gas Fees for Account Access</span>
                </div>
              </div>
            </div>

            {/* Database & JWT Status Pill */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
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
                <span>Create Account</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? "Create Patient Account" : "Welcome Back"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? "Enter your details to create your secure database health record account." 
                  : "Sign in with your registered email and password to receive a JWT session token."}
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
                      hint="JPG/PNG for profile personalization"
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
                label="Password" 
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
                    <span>Remember this session</span>
                  </label>
                  <span className="text-teal-400 hover:text-teal-300 cursor-pointer font-medium">
                    Forgot password?
                  </span>
                </div>
              )}

              {isSignUp && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[11px] leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Your account is stored securely in Neon PostgreSQL with BCrypt salted hash encryption.</span>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl transition-all uppercase tracking-wider text-xs shadow-xl shadow-teal-500/25 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : isSignUp ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Patient Account</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
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
                {isSignUp ? "Already registered? " : "New patient? "}
                <span className="text-teal-400 font-bold underline ml-1">
                  {isSignUp ? "Sign In" : "Create Account"}
                </span>
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
