import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, FileUp, FolderOpen, ShieldCheck, 
  Search, Trash2, Eye, Menu, X, UploadCloud, ChevronDown, LogOut
} from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState([]); 
  const [uploadData, setUploadData] = useState({ title: "", file: null });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); // For the View Modal
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    email: localStorage.getItem("userEmail") || "Loading...",
    fullname: localStorage.getItem("userFullname") || "Patient User",
    role: "Patient",
    avatarInitial: (localStorage.getItem("userFullname") || "P").charAt(0).toUpperCase()
  });

  // Fetch records from Database on load
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`http://localhost:8085/api/records/${user.email}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) return alert("Please provide both title and file.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("title", uploadData.title);
    formData.append("email", user.email);

    try {
      await axios.post("http://localhost:8085/api/records/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Record secured on Blockchain and saved to Database!");
      setUploadData({ title: "", file: null });
      fetchRecords(); 
    } catch (err) {
      alert("Upload failed. Ensure backend is running on 8085 and SecurityConfig is updated.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record from database? (Note: On-chain hashes remain permanent)")) return;
    try {
      await axios.delete(`http://localhost:8085/api/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1e293b] text-white transition-all duration-300 flex flex-col fixed h-full z-50 shadow-xl`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-500 p-2 rounded-lg"><ShieldCheck size={24} /></div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">HealthChain</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} isOpen={isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<FolderOpen size={20} />} label="My Medical Files" active={activeTab === 'files'} isOpen={isSidebarOpen} onClick={() => setActiveTab('files')} />
        </nav>
        
        <button onClick={() => { localStorage.clear(); navigate('/patient/auth'); }} className="p-4 flex items-center gap-4 text-rose-400 hover:bg-rose-500/10 transition-all border-t border-slate-700">
          <LogOut size={20} /> {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Menu size={20} /></button>
            <p className="text-lg font-bold text-slate-800 capitalize leading-tight">{activeTab}</p>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user.fullname}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
               {user.avatarInitial}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* UPLOAD FORM */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileUp className="text-blue-600" size={20}/> Upload New Record
              </h3>
              <form className="space-y-5" onSubmit={handleUpload}>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Record Title</label>
                  <input 
                    type="text" 
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    placeholder="e.g. MRI Brain Scan" 
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                  />
                </div>
                
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  />
                  <UploadCloud className="text-slate-300 group-hover:text-blue-500 mb-3 transition-colors" size={40} />
                  <p className="text-sm font-medium text-slate-600">
                    {uploadData.file ? uploadData.file.name : "Select Image or PDF"}
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                >
                  {isUploading ? "Mining on Blockchain..." : "Secure on Blockchain"}
                </button>
              </form>
            </div>

            {/* RECORDS TABLE */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Dynamic Medical Files</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {records.length} Records On-Chain
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">File Name</th>
                      <th className="px-6 py-4">Blockchain Hash</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.length > 0 ? records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors text-sm">
                        <td className="px-6 py-4 font-bold text-slate-700">{record.title}</td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-500">
                          {record.fileHash ? `${record.fileHash.substring(0, 15)}...` : "N/A"}
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                          <button 
                            onClick={() => handleView(record)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)} 
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="p-20 text-center">
                          <FolderOpen className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="text-slate-400 font-medium">No blockchain records found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* --- VIEW MODAL (POPS UP ON EYE CLICK) --- */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/20">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <ShieldCheck size={24} />
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Blockchain Verified Record</h3>
                  <p className="text-sm text-slate-500">This document is cryptographically secured.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Title</span>
                    <span className="text-sm font-bold text-slate-700">{selectedRecord.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Timestamp</span>
                    <span className="text-sm font-bold text-slate-700">{selectedRecord.date}</span>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 break-all">
                    <p className="text-[10px] font-black uppercase text-blue-600 mb-2 tracking-widest">Transaction CID (Hash)</p>
                    <p className="font-mono text-[11px] leading-relaxed text-blue-800">{selectedRecord.fileHash}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedRecord(null)}
                className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
              >
                Close Verification
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active, isOpen, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon} {isOpen && <span className="text-sm font-semibold">{label}</span>}
  </button>
);

export default PatientDashboard;