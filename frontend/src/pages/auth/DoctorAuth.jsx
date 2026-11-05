import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Stethoscope, 
  User, 
  FileBadge, 
  ArrowLeft, 
  Fingerprint, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Database,
  Building2, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";
import InputField from "../../components/auth/InputField";
import FileUpload from "../../components/auth/FileUpload";
import AuthStatusDialog from "../../components/auth/AuthStatusDialog";
import { API_BASE_URL, setAuthToken } from "../../config/api";

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
    proofFile: null
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
    setStep(1);
  };

  const handleAction = async () => {
    // --- 1. DOCTOR LOGIN (DATABASE + JWT) ---
    if (!isSignUp) {
      if (!formData.email.trim() || !formData.password.trim()) {
        setDialog({
          isOpen: true,
          type: "error",
          title: "Missing Doctor Credentials",
          message: "Please enter your doctor email and access password to sign in.",
          actionText: "Try Again"
        });
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/doctor/login`, {
          email: formData.email.trim(),
          password: formData.password
        });
        
        const data = res.data;
        if (data.token) {
          setAuthToken(data.token);
        }
        localStorage.setItem("userEmail", data.email || formData.email.trim());
        localStorage.setItem("userFullname", data.fullname || "Medical Doctor");
        localStorage.setItem("userSpecialization", data.specialization || "");
        localStorage.setItem("userRole", "Doctor");

        setDialog({
          isOpen: true,
          type: "success",
          title: "Doctor Login Successful!",
          message: `Welcome back, ${data.fullname || "Doctor"}! Your clinical JWT session has been authenticated. Redirecting to your medical consultation console...`,
          actionText: "Opening Console"
        });

        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 1300);

      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || "Check your credentials or verify backend connectivity.";
        setDialog({
          isOpen: true,
          type: "error",
          title: "Doctor Access Denied",
          message: typeof msg === "string" ? msg : "Failed to authenticate doctor account.",
          actionText: "Dismiss"
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // --- 2. SIGNUP PROGRESSION (STEP 1) ---
    if (step === 1) {
      if (!formData.email.trim() || !formData.password.trim() || !formData.fullname.trim()) {
        setDialog({
          isOpen: true,
          type: "error",
          title: "Incomplete Profile",
          message: "Please enter your full doctor name, clinical email, and secure password.",
          actionText: "Complete Step 1"
        });
        return;
      }
      setStep(2);
      return;
    }

    // --- 3. MEDICAL CREDENTIALS UPLOAD & DATABASE STORAGE (STEP 2) ---
    if (!formData.licenseNumber.trim() || !formData.specialization.trim()) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Clinical Credentials Required",
        message: "Please complete your official medical license number and specialty field.",
        actionText: "Review Fields"
      });
      return;
    }
    if (!formData.proofFile) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Medical License Proof Required",
        message: "Medical qualification document or registration certificate is required for practitioner verification.",
        actionText: "Upload Document"
      });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("fullname", formData.fullname.trim());
      data.append("licenseNumber", formData.licenseNumber.trim());
      data.append("regYear", formData.regYear || "2024");
      data.append("medicalCouncil", formData.medicalCouncil || "General Medical Council");
      data.append("specialization", formData.specialization.trim());
      data.append("proofFile", formData.proofFile);

      await axios.post(`${API_BASE_URL}/api/doctor/signup`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Automatically authenticate to obtain JWT token
      const loginRes = await axios.post(`${API_BASE_URL}/api/doctor/login`, {
        email: formData.email.trim(),
        password: formData.password
      });

      if (loginRes.data.token) {
        setAuthToken(loginRes.data.token);
      }
      localStorage.setItem("userEmail", formData.email.trim());
      localStorage.setItem("userFullname", formData.fullname.trim());
      localStorage.setItem("userSpecialization", formData.specialization.trim());
      localStorage.setItem("userRole", "Doctor");

      setDialog({
        isOpen: true,
        type: "success",
        title: "Doctor Registered Successfully!",
        message: `Welcome to HealthChain, ${formData.fullname.trim()}! Your practitioner node has been authorized in Neon PostgreSQL. Generating your clinical session...`,
        actionText: "Entering Console"
      });

      setTimeout(() => {
        navigate('/doctor/dashboard');
      }, 1500);

    } catch (apiErr) {
      let serverMsg = "Signup failed on database. Please verify backend is running.";
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
        title: "Practitioner Registration Error",
        message: serverMsg,
        actionText: "Review Details"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans selection:bg-blue-500/30">
      
      {/* Animated Dialog Box */}
      <AuthStatusDialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        role="Doctor"
        actionText={dialog.actionText}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
      />

      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="cyber-glow w-[550px] h-[550px] bg-blue-600/20 top-[-10%] left-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-indigo-600/15 bottom-[-10%] right-[-10%]" />

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
            <Link
              to="/auth/patient"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </Link>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </span>
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
          className="rounded-[2.5rem] bg-slate-900/70 border border-blue-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Visual Panel */}
          <div className="md:w-5/12 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 p-8 lg:p-10 flex flex-col justify-between text-white relative">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-200 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>JWT Secure Practitioner Access</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Doctor <br />
                <span className="text-blue-200">Practitioner</span> <br />
                Portal
              </h2>

              <p className="text-xs text-blue-100/90 mt-4 leading-relaxed">
                Review diagnostic reports and patient medical histories. Credentials are encrypted and securely stored in our cloud PostgreSQL database with JWT session authentication.
              </p>

              {/* Benefit Bullets */}
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>Stateless JWT Bearer Token Security</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>Secure Cloud License Document Storage</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>BCrypt Salted Password Encryption</span>
                </div>
              </div>
            </div>

            {/* Database Status Pill */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
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
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isSignUp
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Doctor Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSignUp
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register Doctor</span>
              </button>
            </div>

            {/* If Sign Up, display Step 1 / 2 Indicator */}
            {isSignUp && (
              <div className="flex items-center gap-2 mb-6 text-xs">
                <span className={`px-3 py-1 rounded-full font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  1. Account Details
                </span>
                <span className="text-slate-600">→</span>
                <span className={`px-3 py-1 rounded-full font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  2. Medical Credentials
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp 
                  ? (step === 1 ? "Create Practitioner Account" : "Medical Qualifications") 
                  : "Doctor Portal Sign In"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? (step === 1 ? "Enter your email and credentials for database registration." : "Attach official registration proof to verify clinical identity.")
                  : "Sign in with your registered email and password to receive a JWT session token."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
              <AnimatePresence mode="wait">
                {(!isSignUp || (isSignUp && step === 1)) && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: 10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -10 }} 
                    className="space-y-4"
                  >
                    {isSignUp && (
                      <InputField 
                        label="Full Legal Doctor Name" 
                        placeholder="Dr. Alexander Pierce"
                        value={formData.fullname} 
                        onChange={(e) => setFormData({...formData, fullname: e.target.value})} 
                        icon={<User className="w-4 h-4 text-blue-400" />} 
                        required
                      />
                    )}

                    <InputField 
                      label="Doctor Email" 
                      placeholder="dr.name@healthchain.io"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      type="email"
                      icon={<Fingerprint className="w-4 h-4 text-blue-400" />} 
                      required
                    />

                    <InputField 
                      label="Password" 
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      icon={<Lock className="w-4 h-4 text-blue-400" />} 
                      helperText={isSignUp ? "Minimum 6 characters" : ""}
                      required
                    />

                    {!isSignUp && (
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300">
                          <input type="checkbox" className="w-4 h-4 rounded accent-blue-600 bg-slate-900 border-white/10" />
                          <span>Remember doctor session</span>
                        </label>
                        <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">
                          Forgot password?
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {isSignUp && step === 2 && (
                  <motion.div 
                    key="step2" 
                    initial={{ opacity: 0, x: 10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -10 }} 
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <InputField 
                        label="Medical License #" 
                        placeholder="MD-8821" 
                        value={formData.licenseNumber} 
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} 
                        icon={<FileBadge className="w-4 h-4 text-blue-400" />} 
                        required
                      />
                      <InputField 
                        label="Reg. Year" 
                        type="number" 
                        placeholder="2020" 
                        value={formData.regYear} 
                        onChange={(e) => setFormData({...formData, regYear: e.target.value})} 
                      />
                    </div>

                    <InputField 
                      label="Specialization" 
                      placeholder="e.g. Cardiology, Neurology, Oncology" 
                      value={formData.specialization} 
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
                      icon={<Award className="w-4 h-4 text-blue-400" />} 
                      required
                    />

                    <InputField 
                      label="Medical Council" 
                      placeholder="e.g. National Medical Commission" 
                      value={formData.medicalCouncil} 
                      onChange={(e) => setFormData({...formData, medicalCouncil: e.target.value})} 
                    />
                    
                    <FileUpload 
                      label="Official Qualification Document / Proof" 
                      hint="Medical Degree or Institutional ID (PDF/JPG)"
                      onChange={(file) => setFormData(prev => ({...prev, proofFile: file}))} 
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-3">
                {isSignUp && step === 2 && (
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="flex-1 py-3.5 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
                  >
                    Back
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-xl shadow-blue-600/25 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : isSignUp ? (
                    step === 1 ? (
                      <>
                        <span>Next: Medical Credentials</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Register Practitioner</span>
                      </>
                    )
                  ) : (
                    <>
                      <span>Sign In to Doctor Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <button 
                type="button" 
                onClick={() => toggleMode(!isSignUp)} 
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {isSignUp ? "Already a registered doctor? " : "New medical specialist? "} 
                <span className="text-blue-400 underline font-bold ml-1">
                  {isSignUp ? "Sign In" : "Register Doctor"}
                </span>
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
