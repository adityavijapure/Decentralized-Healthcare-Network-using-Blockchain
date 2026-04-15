import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Key, Users, ClipboardList, 
  Search, Eye, Trash2, Bell, Menu, X, ShieldAlert,
  ChevronDown, Activity, Heart, LogOut, Send
} from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState([]);
  const [requestData, setRequestData] = useState({ patientEmail: "", requestType: "Full Medical History" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- 1. DYNAMIC USER SESSION ---
  const [doctor, setDoctor] = useState({
    name: localStorage.getItem("userFullname") || "Verified Doctor",
    email: localStorage.getItem("userEmail") || "Loading...",
    role: "Doctor",
    specialization: localStorage.getItem("userSpecialization") || "General Practitioner",
    avatarInitial: (localStorage.getItem("userFullname") || "D").charAt(0)
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (!savedEmail) {
      navigate('/doctor/auth');
    } else {
      fetchAccessibleRecords();
    }
  }, [navigate]);

  // --- 2. BLOCKCHAIN & DATABASE FETCH ---
  const fetchAccessibleRecords = async () => {
    try {
      // Fetches records where this doctor has been granted access on the blockchain
      const res = await axios.get(`http://localhost:8085/api/doctor/records/${localStorage.getItem("userEmail")}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Access denied or server offline.");
      // Fallback to empty if unauthorized
      setRecords([]);
    }
  };

  // --- 3. SEND ACCESS REQUEST ---
  const handleRequestAccess = async (e) => {
    e.preventDefault();
    if (!requestData.patientEmail) return alert("Please enter a patient email.");
    
    setLoading(true);
    try {
      await axios.post("http://localhost:8085/api/doctor/request-access", {
        doctorEmail: doctor.email,
        patientEmail: requestData.patientEmail,
        type: requestData.requestType
      });
      alert(`Request sent to ${requestData.patientEmail}. Pending Patient Approval on Blockchain.`);
      setRequestData({ ...requestData, patientEmail: "" });
    } catch (err) {
      alert("Request failed. Ensure patient email exists in the network.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/doctor/auth');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1e293b] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-indigo-500 p-2 rounded-lg"><Activity size={24} /></div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">HealthChain</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} isOpen={isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Key size={20} />} label="Request Access" active={activeTab === 'requests'} isOpen={isSidebarOpen} onClick={() => setActiveTab('requests')} />
          <NavItem icon={<ClipboardList size={20} />} label="Audit Logs" active={activeTab === 'logs'} isOpen={isSidebarOpen} onClick={() => setActiveTab('logs')} />
          
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all mt-10">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Doctor Portal</h2>
               <p className="text-lg font-bold text-slate-800 mt-1">{doctor.specialization} Node</p>
            </div>
          </div>

          <div className="flex items-center gap-5 border-l pl-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Verified {doctor.role}
                </span>
                <p className="text-sm font-bold text-slate-800">{doctor.name}</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{doctor.email}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 border-2 border-white">
              {doctor.avatarInitial}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* SPECIALIZATION ALERT */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-4">
            <ShieldAlert className="text-indigo-600 mt-1" size={20} />
            <div>
              <p className="text-sm font-bold text-indigo-800 tracking-tight">Active Blockchain Credentials</p>
              <p className="text-xs text-indigo-700 opacity-80">Encryption keys for {doctor.specialization} department are loaded. You can now request cross-departmental access if required.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* REQUEST FORM */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 h-fit">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Request Access</h3>
              <form className="space-y-4" onSubmit={handleRequestAccess}>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Patient Network ID (Email)</label>
                  <input 
                    type="email" 
                    value={requestData.patientEmail}
                    onChange={(e) => setRequestData({...requestData, patientEmail: e.target.value})}
                    placeholder="patient@healthchain.io" 
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Request Type</label>
                  <select 
                    value={requestData.requestType}
                    onChange={(e) => setRequestData({...requestData, requestType: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                  >
                    <option>Full Medical History</option>
                    <option>Diagnostic Reports Only</option>
                    <option>Emergency View</option>
                  </select>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} /> {loading ? "Broadcasting..." : "Send Access Request"}
                </button>
              </form>
            </div>

            {/* ACCESSIBLE RECORDS TABLE */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-800">Decrypted Records</h3>
                <div className="text-[10px] font-bold text-indigo-600 uppercase px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                  {records.length} Records Verified
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Record & Patient</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.length > 0 ? records.map((record) => (
                      <tr key={record.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{record.title}</span>
                            <span className="text-[10px] text-indigo-500 font-mono tracking-tighter">{record.patientEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                            On-Chain Verified
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2">
                              <Eye size={14} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="p-20 text-center">
                          <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="text-slate-400 font-medium">No patient data shared with this node yet.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active, isOpen, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    {icon} {isOpen && <span className="text-sm font-semibold">{label}</span>}
  </button>
);

export default DoctorDashboard;