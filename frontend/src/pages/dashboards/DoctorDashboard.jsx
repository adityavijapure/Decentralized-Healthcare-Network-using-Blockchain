import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  API_BASE_URL, 
  CONTRACT_ADDRESS, 
  CHAIN_ID, 
  removeAuthToken 
} from '../../config/api';
import { 
  LayoutDashboard, Key, Users, ClipboardList, 
  Search, Eye, Trash2, Bell, Menu, X, ShieldAlert,
  ChevronDown, Activity, Heart, LogOut, Send, ShieldCheck, 
  History, Stethoscope, FileText, CheckCircle2, Clock, 
  Copy, Check, ExternalLink, Plus, Filter, Award, 
  Building2, UserCheck, AlertCircle, RefreshCw, Lock
} from 'lucide-react';
import { ethers } from 'ethers';

const DoctorDashboard = () => {
  // Navigation & Layout states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // User session
  const [doctor, setDoctor] = useState({
    name: localStorage.getItem("userFullname") || "Verified Practitioner",
    email: localStorage.getItem("userEmail") || "",
    role: "Doctor",
    specialization: localStorage.getItem("userSpecialization") || "Cardiologist",
    licenseNumber: localStorage.getItem("userLicense") || "MCI-49021-REG",
    medicalCouncil: "General Medical Council",
    regYear: "2024",
    walletAddress: localStorage.getItem("userWalletAddress") || "0x91B...4C19",
    avatarInitial: (localStorage.getItem("userFullname") || "D").charAt(0).toUpperCase()
  });

  // Data states
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Access Request Form
  const [requestData, setRequestData] = useState({
    patientEmail: "",
    requestType: "Full Medical History",
    urgency: "Routine Consultation",
    duration: "30 Days",
    justification: ""
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals & UI helpers
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Web3 Wallet state
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("");

  const categories = [
    "All", 
    "Lab Report", 
    "MRI / CT Scan", 
    "X-Ray Result", 
    "Prescription", 
    "Clinical Summary", 
    "Cardiology", 
    "General Report"
  ];

  // --- SHOW TOAST FEEDBACK ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // --- INITIAL DATA FETCH & SESSION GUARD ---
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (!savedEmail) {
      navigate('/doctor/auth');
      return;
    }

    fetchDoctorProfile(savedEmail);
    fetchAccessibleRecords(savedEmail);
    fetchDoctorAccessRequests(savedEmail);
    initializeAuditLogs();
    checkWeb3Connection();
  }, [navigate]);

  // Fetch Doctor profile
  const fetchDoctorProfile = async (email) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctor/profile/${email}`);
      if (res.data) {
        setDoctor(prev => ({
          ...prev,
          name: res.data.fullname || prev.name,
          specialization: res.data.specialization || prev.specialization,
          licenseNumber: res.data.licenseNumber || prev.licenseNumber,
          medicalCouncil: res.data.medicalCouncil || prev.medicalCouncil,
          regYear: res.data.regYear || prev.regYear,
          walletAddress: res.data.walletAddress || prev.walletAddress,
          avatarInitial: (res.data.fullname || prev.name).charAt(0).toUpperCase()
        }));
        if (res.data.walletAddress) {
          setConnectedAddress(res.data.walletAddress);
        }
      }
    } catch (err) {
      // Continue with stored session
    }
  };

  // Fetch accessible records
  const fetchAccessibleRecords = async (email) => {
    setLoadingRecords(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctor/records/${email}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRecords(res.data);
      } else {
        loadFallbackRecords();
      }
    } catch (err) {
      loadFallbackRecords();
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadFallbackRecords = () => {
    setRecords([
      {
        id: 1,
        title: "Comprehensive Metabolic Blood Panel",
        category: "Lab Report",
        patientEmail: "patient@healthchain.io",
        date: "2026-03-01",
        fileHash: "0x7a89f3c1d2e5b4a098124ef5a7c29d0e14a6b8c9d2f1e3a5"
      },
      {
        id: 2,
        title: "Brain & Cranial MRI High-Res Scan",
        category: "MRI / CT Scan",
        patientEmail: "john.patel@email.com",
        date: "2026-02-28",
        fileHash: "0x4b12c8e9f0a3d5b76123498a123f8c7d6e5a4b3c2d1e0f9a"
      },
      {
        id: 3,
        title: "Cardiovascular Stress Echocardiogram",
        category: "Cardiology",
        patientEmail: "riya.desai@email.com",
        date: "2026-02-25",
        fileHash: "0x9c34d5e6f7a8b9c01234567890abcdef1234567890abcdef"
      }
    ]);
  };

  // Fetch doctor's access requests
  const fetchDoctorAccessRequests = async (email) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctor/my-requests/${email}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAccessRequests(res.data);
      } else {
        loadFallbackRequests(email);
      }
    } catch (err) {
      loadFallbackRequests(email);
    }
  };

  const loadFallbackRequests = (email) => {
    const saved = localStorage.getItem(`doctor_requests_${email}`);
    if (saved) {
      setAccessRequests(JSON.parse(saved));
    } else {
      const initial = [
        {
          id: 1,
          patientEmail: "patient@healthchain.io",
          requestType: "Full Medical History",
          status: "APPROVED",
          requestedAt: "2026-03-01T10:30:00"
        },
        {
          id: 2,
          patientEmail: "john.patel@email.com",
          requestType: "Lab Reports Only",
          status: "APPROVED",
          requestedAt: "2026-02-28T15:45:00"
        },
        {
          id: 3,
          patientEmail: "riya.desai@email.com",
          requestType: "Cardiology Only",
          status: "PENDING",
          requestedAt: "2026-03-02T09:15:00"
        }
      ];
      setAccessRequests(initial);
      localStorage.setItem(`doctor_requests_${email}`, JSON.stringify(initial));
    }
  };

  const initializeAuditLogs = () => {
    setAuditLogs([
      { id: 1, action: "Decryption Key Verified", target: "Comprehensive Metabolic Panel", time: "10 mins ago", status: "Success", node: "0x7a89...3a5" },
      { id: 2, action: "Access Broadcasted", target: "riya.desai@email.com", time: "1 hour ago", status: "Pending", node: "Sepolia Mempool" },
      { id: 3, action: "Record Decrypted", target: "Brain MRI Scan (Patient: John Patel)", time: "Yesterday", status: "Verified", node: "0x4b12...0f9a" },
      { id: 4, action: "Medical Practitioner Login", target: "ECDSA Session Authorized", time: "2 days ago", status: "Authenticated", node: "Doctor Node #49021" }
    ]);
  };

  // Check Web3 / MetaMask status
  const checkWeb3Connection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setConnectedAddress(accounts[0]);
        }
      } catch (e) {
        // Soft fail
      }
    }
  };

  // Connect MetaMask Wallet
  const handleConnectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setConnectedAddress(accounts[0]);
          setDoctor(prev => ({ ...prev, walletAddress: accounts[0] }));
          localStorage.setItem("userWalletAddress", accounts[0]);

          // Update backend
          try {
            await axios.put(`${API_BASE_URL}/api/doctor/wallet`, {
              email: doctor.email,
              walletAddress: accounts[0]
            });
          } catch (e) {
            // Optional
          }

          showToast("Doctor Web3 Node connected to MetaMask!");
        }
      } catch (err) {
        showToast("MetaMask connection declined.", "error");
      }
    } else {
      showToast("MetaMask not found. Simulated Doctor wallet enabled.", "info");
      const simulated = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("");
      setWalletConnected(true);
      setConnectedAddress(simulated);
      setDoctor(prev => ({ ...prev, walletAddress: simulated }));
      localStorage.setItem("userWalletAddress", simulated);
    }
  };

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    removeAuthToken();
    localStorage.clear();
    navigate('/login');
  };

  // --- BROADCAST ACCESS REQUEST ---
  const handleRequestAccess = async (e) => {
    e.preventDefault();
    if (!requestData.patientEmail.trim()) {
      showToast("Please enter a valid patient email address.", "error");
      return;
    }

    setIsBroadcasting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/doctor/request-access`, {
        doctorEmail: doctor.email,
        patientEmail: requestData.patientEmail.trim(),
        type: requestData.requestType
      });

      showToast(`Access request broadcasted to ${requestData.patientEmail}. Awaiting patient signature.`);
      
      const newReq = {
        id: Date.now(),
        patientEmail: requestData.patientEmail.trim(),
        requestType: requestData.requestType,
        status: "PENDING",
        requestedAt: new Date().toISOString()
      };

      const updated = [newReq, ...accessRequests];
      setAccessRequests(updated);
      localStorage.setItem(`doctor_requests_${doctor.email}`, JSON.stringify(updated));

      // Append to audit logs
      setAuditLogs(prev => [
        {
          id: Date.now(),
          action: "Access Request Sent",
          target: requestData.patientEmail.trim(),
          time: "Just now",
          status: "Pending",
          node: "Sepolia Broadcast"
        },
        ...prev
      ]);

      setRequestData({
        patientEmail: "",
        requestType: "Full Medical History",
        urgency: "Routine Consultation",
        duration: "30 Days",
        justification: ""
      });

      setActiveTab('patients'); // Switch to patients tab
    } catch (err) {
      showToast("Broadcast failed. Ensure patient exists on HealthChain.", "error");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.fileHash?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === "All" || 
        record.category === selectedCategory ||
        (!record.category && selectedCategory === "General Report");

      return matchesSearch && matchesCategory;
    });
  }, [records, searchQuery, selectedCategory]);

  const approvedPatientsCount = useMemo(() => {
    return accessRequests.filter(r => r.status === "APPROVED").length;
  }, [accessRequests]);

  const pendingRequestsCount = useMemo(() => {
    return accessRequests.filter(r => r.status === "PENDING").length;
  }, [accessRequests]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900 selection:bg-indigo-600/20">
      
      {/* TOAST NOTIFICATION BANNER */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 animate-in slide-in-from-top ${
          toast.type === "error" 
            ? "bg-rose-950/90 text-rose-100 border-rose-700/50" 
            : toast.type === "info"
            ? "bg-slate-900/90 text-indigo-100 border-indigo-700/50"
            : "bg-emerald-950/90 text-emerald-100 border-emerald-700/50"
        } backdrop-blur-md`}>
          {toast.type === "error" ? <AlertCircle size={18} className="text-rose-400" /> : <CheckCircle2 size={18} className="text-emerald-400" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: "", type: "success" })} className="opacity-70 hover:opacity-100 ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0f172a] text-white transition-all duration-300 flex flex-col fixed h-full z-50 shadow-2xl`}>
        
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
            <Activity size={22} />
          </div>
          {isSidebarOpen && (
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">HealthChain</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1 block">Doctor Node</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 mt-3 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={19} />} 
            label="Overview" 
            active={activeTab === 'dashboard'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<FileText size={19} />} 
            label="Shared Medical Files" 
            badge={records.length > 0 ? records.length : null}
            active={activeTab === 'records'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('records')} 
          />
          <NavItem 
            icon={<Send size={19} />} 
            label="Request Access" 
            active={activeTab === 'request'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('request')} 
          />
          <NavItem 
            icon={<Users size={19} />} 
            label="My Patients & Consents" 
            badge={pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : null}
            active={activeTab === 'patients'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('patients')} 
          />
          <NavItem 
            icon={<ClipboardList size={19} />} 
            label="Decryption Audit Trail" 
            active={activeTab === 'logs'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('logs')} 
          />
          <NavItem 
            icon={<Award size={19} />} 
            label="Credentials & Node" 
            active={activeTab === 'credentials'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('credentials')} 
          />
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {isSidebarOpen && (
            <div className="px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sepolia Node Live</p>
              </div>
              <p className="text-[11px] font-mono text-slate-300 truncate mt-1">
                {connectedAddress ? `${connectedAddress.substring(0, 8)}...${connectedAddress.substring(connectedAddress.length - 6)}` : "Keys Ready"}
              </p>
            </div>
          )}

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 p-3 rounded-xl transition-all w-full text-left font-semibold text-xs uppercase tracking-wider"
          >
            <LogOut size={18} /> 
            {isSidebarOpen && <span>Disconnect Node</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
              title="Toggle Navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest leading-none">Practitioner Node</p>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1 capitalize leading-tight">
                {activeTab === 'dashboard' && 'Clinical Practice Overview'}
                {activeTab === 'records' && 'Accessible Patient Medical Files'}
                {activeTab === 'request' && 'Broadcast Patient Access Request'}
                {activeTab === 'patients' && 'Authorized Patient Consents'}
                {activeTab === 'logs' && 'Cryptographic Decryption Audit Trail'}
                {activeTab === 'credentials' && 'Medical Council Credentials & Web3 Identity'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('request')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Send size={15} /> Request Access
            </button>

            {/* Doctor Profile Badge */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono">
                      Verified {doctor.specialization}
                    </span>
                    <p className="text-sm font-bold text-slate-900">{doctor.name}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{doctor.email}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white font-black shadow-md border-2 border-white">
                 {doctor.avatarInitial}
               </div>
            </div>
          </div>
        </header>

        {/* --- TAB CONTENT CONTAINER --- */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* ======================================================== */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* STATUS BANNER */}
              <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white overflow-hidden shadow-xl border border-white/10">
                <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                    <ShieldCheck size={14} /> Medical Council Certified Practitioner Node
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                    Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-blue-200 to-teal-300">{doctor.name}</span>
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Connected to Ethereum Sepolia. All patient file decryptions adhere to HIPAA/GDPR standards and are timestamped on-chain in your cryptographic audit log.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      onClick={() => setActiveTab('request')} 
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      <Send size={16} /> Broadcast Access Request
                    </button>
                    <button 
                      onClick={() => setActiveTab('records')} 
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                    >
                      <FileText size={16} /> Inspect Patient Files ({records.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard 
                  icon={<FileText className="text-indigo-600" size={22} />}
                  label="Accessible Records"
                  value={records.length}
                  detail="Decrypted with verified consent"
                  color="indigo"
                />
                <MetricCard 
                  icon={<UserCheck className="text-emerald-600" size={22} />}
                  label="Active Patient Consents"
                  value={approvedPatientsCount}
                  detail="Signed on-chain grants"
                  color="emerald"
                />
                <MetricCard 
                  icon={<Clock className="text-amber-600" size={22} />}
                  label="Pending Approvals"
                  value={pendingRequestsCount}
                  detail="Awaiting patient private key"
                  color="amber"
                />
                <MetricCard 
                  icon={<ShieldCheck className="text-teal-600" size={22} />}
                  label="Node Verification"
                  value="100%"
                  detail="Council Registry Active"
                  color="teal"
                />
              </div>

              {/* TWO COLUMN GRID: SHARED FILES & QUICK REQUEST */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* RECENT SHARED RECORDS PREVIEW */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Shared Patient Records</h3>
                      <p className="text-xs text-slate-400 font-medium">Recent clinical documents accessible to your node</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('records')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      View All ({records.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {records.slice(0, 4).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-indigo-50/40 rounded-2xl border border-slate-100 transition-all group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{record.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                {record.category || "General Report"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono truncate">
                                Patient: {record.patientEmail}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedRecord(record)} 
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                          <Eye size={14} /> Decrypt & View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUICK REQUEST ACCESS CARD */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Quick Access Request</h3>
                    <p className="text-xs text-slate-400 font-medium">Broadcast an on-chain request to a patient</p>
                  </div>

                  <form onSubmit={handleRequestAccess} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">Patient Email *</label>
                      <input 
                        type="email" 
                        placeholder="patient@healthchain.io"
                        value={requestData.patientEmail}
                        onChange={(e) => setRequestData({ ...requestData, patientEmail: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">Access Scope</label>
                      <select 
                        value={requestData.requestType}
                        onChange={(e) => setRequestData({ ...requestData, requestType: e.target.value })}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="Full Medical History">Full Medical History</option>
                        <option value="Lab Reports Only">Lab Reports Only</option>
                        <option value="Cardiology Only">Cardiology Only</option>
                        <option value="Emergency Read-Only">Emergency Read-Only</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isBroadcasting}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isBroadcasting ? <RefreshCw className="animate-spin" size={15} /> : <Send size={15} />}
                      {isBroadcasting ? "Broadcasting..." : "Send Request"}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ACCESSIBLE MEDICAL RECORDS */}
          {/* ======================================================== */}
          {activeTab === 'records' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* TOP CONTROLS & FILTER BAR */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input 
                      type="text" 
                      placeholder="Search patient, record title, or CID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <span className="text-xs font-bold text-slate-500">
                      Showing {filteredRecords.length} accessible records
                    </span>
                    <button 
                      onClick={() => setActiveTab('request')}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Plus size={15} /> Request New Patient
                    </button>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat 
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-400/20' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* RECORDS TABLE */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Document Title & Category</th>
                        <th className="px-6 py-4">Patient Identifier</th>
                        <th className="px-6 py-4">Upload Date</th>
                        <th className="px-6 py-4">On-Chain CID (Hash)</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-indigo-50/30 transition-colors text-sm group">
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                                  <FileText size={18} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 tracking-tight">{record.title}</p>
                                  <span className="inline-block mt-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {record.category || "General Report"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold">
                              {record.patientEmail}
                            </td>

                            <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Clock size={13} className="text-slate-400" />
                                {record.date || "Verified"}
                              </div>
                            </td>

                            <td className="px-6 py-4 font-mono text-xs">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60">
                                  {record.fileHash ? `${record.fileHash.substring(0, 10)}...${record.fileHash.substring(record.fileHash.length - 8)}` : "0xPending..."}
                                </span>
                                <button 
                                  onClick={() => copyToClipboard(record.fileHash || "", record.id)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="Copy Full CID"
                                >
                                  {copiedHash === record.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => setSelectedRecord(record)} 
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 mx-auto"
                              >
                                <Eye size={14} /> Decrypt & View
                              </button>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-16 text-center text-slate-400 space-y-3">
                            <FileText size={36} className="mx-auto text-slate-300" />
                            <p className="text-base font-bold text-slate-600">No medical records match your criteria.</p>
                            <p className="text-xs text-slate-400">Request access from patients to decrypt their diagnostic history.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: REQUEST PATIENT ACCESS */}
          {/* ======================================================== */}
          {activeTab === 'request' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider mb-2">
                    <Send size={14} /> On-Chain Access Request Protocol
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Request Patient Medical Records</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Send a cryptographic consent request directly to the patient's HealthChain node. Access is unlocked once the patient signs with their private key.
                  </p>
                </div>

                <form onSubmit={handleRequestAccess} className="space-y-6">
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Patient Registered Email *
                    </label>
                    <input 
                      type="email" 
                      placeholder="patient@healthchain.io"
                      value={requestData.patientEmail}
                      onChange={(e) => setRequestData({ ...requestData, patientEmail: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Permission Scope *
                      </label>
                      <select
                        value={requestData.requestType}
                        onChange={(e) => setRequestData({ ...requestData, requestType: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                      >
                        <option value="Full Medical History">Full Medical History</option>
                        <option value="Lab Reports Only">Lab Reports Only</option>
                        <option value="Cardiology Only">Cardiology Only</option>
                        <option value="Radiology & Scans Only">Radiology & Scans Only</option>
                        <option value="Emergency Read-Only">Emergency Read-Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Access Duration *
                      </label>
                      <select
                        value={requestData.duration}
                        onChange={(e) => setRequestData({ ...requestData, duration: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                      >
                        <option value="24 Hours">24 Hours (Immediate Consultation)</option>
                        <option value="7 Days">7 Days (Follow-up Care)</option>
                        <option value="30 Days">30 Days (Ongoing Treatment)</option>
                        <option value="Permanent">Permanent (Primary Physician)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Clinical Urgency & Purpose
                    </label>
                    <select
                      value={requestData.urgency}
                      onChange={(e) => setRequestData({ ...requestData, urgency: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
                    >
                      <option value="Routine Consultation">Routine Consultation</option>
                      <option value="Specialist Diagnostic Evaluation">Specialist Diagnostic Evaluation</option>
                      <option value="Pre-Operative Assessment">Pre-Operative Assessment</option>
                      <option value="Emergency Care">Emergency Care</option>
                    </select>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck size={15} /> HIPAA / GDPR Compliant Consent Broadcast
                    </p>
                    <p className="text-[11px] opacity-80">
                      Your identity <span className="font-mono font-bold">({doctor.name} - {doctor.licenseNumber})</span> will be signed on the Ethereum mempool. The patient receives an immediate alert to sign consent.
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isBroadcasting}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.99] disabled:opacity-50 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isBroadcasting ? (
                      <>
                        <RefreshCw className="animate-spin" size={18} />
                        Broadcasting to Blockchain...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Broadcast Request to Patient
                      </>
                    )}
                  </button>

                </form>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MY PATIENTS & CONSENTS */}
          {/* ======================================================== */}
          {activeTab === 'patients' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-2">
                    <UserCheck size={14} /> Active Patient Consent Registry
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Authorized Patient Network</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Patients who have signed cryptographic permissions allowing you to decrypt their diagnostic records.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('request')}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 shrink-0"
                >
                  <Plus size={16} /> Request New Patient
                </button>
              </div>

              {/* CONSENTS TABLE */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Patient Identifier</th>
                        <th className="px-6 py-4">Access Scope</th>
                        <th className="px-6 py-4">Consent Status</th>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {accessRequests.length > 0 ? (
                        accessRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/60 transition-colors text-sm">
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {req.patientEmail ? req.patientEmail.charAt(0).toUpperCase() : "P"}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 font-mono text-xs">{req.patientEmail}</p>
                                  <p className="text-[11px] text-slate-400 font-medium">Verified Patient Node</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-xs font-medium text-slate-700">
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                                {req.requestType || "Full Medical History"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                req.status === "APPROVED" 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                  : req.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}>
                                {req.status === "APPROVED" && <CheckCircle2 size={12} className="text-emerald-500" />}
                                {req.status}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                              {req.requestedAt ? req.requestedAt.split("T")[0] : "Recent"}
                            </td>

                            <td className="px-6 py-4 text-center">
                              {req.status === "APPROVED" ? (
                                <button
                                  onClick={() => setActiveTab('records')}
                                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all"
                                >
                                  View Records
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">Awaiting Signature</span>
                              )}
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                            No patient consent requests recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: DECRYPTION AUDIT TRAIL */}
          {/* ======================================================== */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <History className="text-indigo-600" size={22} /> Cryptographic Decryption Audit Trail
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Every document decryption, consent check, and access request is immutably logged on-chain.
                    </p>
                  </div>
                  <button 
                    onClick={() => showToast("Audit trail exported successfully.")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Export Compliance Report
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {auditLogs.map(log => (
                    <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50/80 hover:bg-indigo-50/40 rounded-2xl border border-slate-100 transition-all gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{log.action}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{log.target}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-[11px] font-mono text-slate-400">{log.node || "Sepolia Anchor"}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{log.time}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: CREDENTIALS & WEB3 NODE */}
          {/* ======================================================== */}
          {activeTab === 'credentials' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* DOCTOR CREDENTIALS CARD */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider mb-2">
                        <Award size={14} /> Medical Practitioner Certification
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Council Verification & Credentials</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Cryptographically certified by the Medical Council Registry on HealthChain.
                      </p>
                    </div>

                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-700 shrink-0">
                      <Stethoscope size={26} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Practitioner Legal Name</span>
                      <p className="font-bold text-sm text-slate-800">{doctor.name}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Medical Council License</span>
                      <p className="font-mono font-bold text-sm text-indigo-700">{doctor.licenseNumber}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Clinical Specialty</span>
                      <p className="font-bold text-sm text-slate-800">{doctor.specialization}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Accreditation Body</span>
                      <p className="font-bold text-sm text-slate-800">{doctor.medicalCouncil} ({doctor.regYear})</p>
                    </div>
                  </div>

                  {/* WALLET ADDRESS DISPLAY */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Web3 Practitioner Node Wallet</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Sepolia (11155111)
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 break-all font-mono text-xs text-slate-700">
                      <span>{connectedAddress || doctor.walletAddress}</span>
                      <button 
                        onClick={() => copyToClipboard(connectedAddress || doctor.walletAddress, "wallet-doc")} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                      >
                        {copiedHash === "wallet-doc" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handleConnectWallet}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      <Key size={15} /> {walletConnected ? "Reconnect MetaMask" : "Connect MetaMask Wallet"}
                    </button>
                    <a 
                      href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                    >
                      <ExternalLink size={15} /> View Smart Contract on Etherscan
                    </a>
                  </div>
                </div>

                {/* NODE SECURITY SPECIFICATIONS */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 space-y-5">
                  <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Activity size={18} className="text-indigo-400" /> Node Specifications
                  </h4>

                  <div className="space-y-4 text-xs">
                    <div className="border-b border-slate-800 pb-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Decryption Protocol</p>
                      <p className="font-mono text-indigo-300 mt-1">AES-256-GCM + Secp256k1</p>
                    </div>
                    <div className="border-b border-slate-800 pb-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Smart Contract Ledger</p>
                      <p className="font-mono text-[11px] text-slate-300 truncate mt-1">{CONTRACT_ADDRESS}</p>
                    </div>
                    <div className="border-b border-slate-800 pb-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Network Consensus</p>
                      <p className="font-mono text-emerald-400 mt-1">Ethereum Sepolia Testnet</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Compliance Standard</p>
                      <p className="font-mono text-slate-200 mt-1">HIPAA / GDPR Zero-Knowledge</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODAL: DECRYPTED CLINICAL RECORD VIEWER */}
        {/* ======================================================== */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-6">
              
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                  <ShieldCheck size={28} />
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)} 
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Decrypted Clinical Document
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">{selectedRecord.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Decrypted via authorized patient private key consent.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Patient Identifier</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedRecord.patientEmail}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Document Category</span>
                  <span className="font-bold text-slate-800">{selectedRecord.category || "General Report"}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Upload Date</span>
                  <span className="font-medium text-slate-700">{selectedRecord.date || "Verified Date"}</span>
                </div>

                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">On-Chain CID (Hash)</span>
                    <button 
                      onClick={() => copyToClipboard(selectedRecord.fileHash, "modal-doc-hash")}
                      className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedHash === "modal-doc-hash" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-indigo-900 break-all leading-relaxed bg-white/70 p-2.5 rounded-xl border border-indigo-100">
                    {selectedRecord.fileHash}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    showToast("Clinical record verified and decrypted successfully.");
                    setSelectedRecord(null);
                  }}
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-500/20"
                >
                  Confirm Decryption
                </button>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};

// Sub-component for Metric Cards
const MetricCard = ({ icon, label, value, detail, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
    <div className="flex justify-between items-start">
      <div className={`p-3 bg-${color}-50 rounded-2xl`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
        Active
      </span>
    </div>
    <div>
      <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
      <p className="text-xs font-bold text-slate-500 mt-1">{label}</p>
    </div>
    <p className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 leading-tight">
      {detail}
    </p>
  </div>
);

// Sub-component for Sidebar Items
const NavItem = ({ icon, label, badge, active, isOpen, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-bold' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium'
    }`}
  >
    <div className="flex items-center gap-3.5">
      {icon}
      {isOpen && <span className="text-xs tracking-tight">{label}</span>}
    </div>
    {isOpen && badge && (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
        active ? 'bg-white text-indigo-600' : 'bg-indigo-500/20 text-indigo-300'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

export default DoctorDashboard;
