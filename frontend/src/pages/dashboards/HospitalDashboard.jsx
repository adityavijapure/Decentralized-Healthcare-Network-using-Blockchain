import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  ClipboardCheck, 
  Search, 
  Trash2, 
  Menu, 
  X, 
  UploadCloud, 
  Building2, 
  Bell, 
  LogOut,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Simulated Hospital/Lab Identity Data
  const hospital = {
    name: "City Hospital & Lab",
    email: "admin@cityhospital.io",
    role: "Hospital/Lab",
    avatarInitial: "CH"
  };

  // Recently Uploaded Reports Data
  const [recentUploads, setRecentUploads] = useState([
    { id: 1, patient: "John Patel", report: "Blood Test Report", date: "06 Feb 2026", status: "Verified" },
    { id: 2, patient: "Riya Desai", report: "MRI Brain Scan", date: "03 Feb 2026", status: "Verified" },
    { id: 3, patient: "Aditya Jain", report: "X-Ray Chest", date: "01 Feb 2026", status: "Verified" },
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      
      {/* SIDEBAR - Dark Slate Theme */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1e293b] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
            <Building2 size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">HealthChain</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<FileUp size={20} />} 
            label="Upload Reports" 
            active={activeTab === 'upload'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('upload')} 
          />
          <NavItem 
            icon={<ClipboardCheck size={20} />} 
            label="Verify Patient" 
            active={activeTab === 'verify'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('verify')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors w-full p-2">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* HOSPITAL IDENTITY NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:block">
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Hospital Management</h2>
               <p className="text-lg font-bold text-slate-800 capitalize mt-1 leading-tight">{activeTab}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Identity Bar */}
            <div className="flex items-center gap-4 pl-5 border-l border-slate-200">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Verified Lab
                  </span>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{hospital.name}</p>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{hospital.email}</p>
              </div>

              {/* Lab Avatar */}
              <div className="relative cursor-pointer hover:scale-105 transition-transform">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100 border-2 border-white">
                  {hospital.avatarInitial}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Quick Action Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickCard icon={<FileUp className="text-emerald-600" />} title="Upload Report" desc="Direct upload to patient account" color="emerald" />
            <QuickCard icon={<ClipboardCheck className="text-blue-600" />} title="Verify Patient" desc="Confirm blockchain identity" color="blue" />
            <QuickCard icon={<LayoutDashboard className="text-slate-600" />} title="Lab History" desc="Manage uploaded records" color="slate" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* DIRECT UPLOAD FORM */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <UploadCloud size={20} className="text-emerald-600" />
                New Medical Report
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Patient Email*</label>
                  <input 
                    type="email" 
                    placeholder="john.patel@email.com" 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Report Type*</label>
                  <select className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option>Blood Test Report</option>
                    <option>MRI / CT Scan</option>
                    <option>X-Ray Result</option>
                    <option>Pathology Report</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Attach Document</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-emerald-400 transition-colors bg-slate-50/50 group cursor-pointer">
                    <FileUp className="text-slate-300 group-hover:text-emerald-500 transition-colors mb-2" size={32} />
                    <p className="text-xs font-bold text-slate-600 italic">Choose File <span className="text-slate-400 font-normal">No file chosen</span></p>
                  </div>
                </div>
                <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
                  Upload to Patient Account
                </button>
              </form>
            </div>

            {/* RECENT UPLOADS TABLE */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recently Uploaded Reports</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Filter reports..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Patient Name</th>
                      <th className="px-6 py-4">Report Type</th>
                      <th className="px-6 py-4">Uploaded On</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentUploads.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{u.patient}</span>
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-tighter">
                              <CheckCircle2 size={10} /> Identity Verified
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">{u.report}</td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">{u.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                  Generate Full Lab Report History
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Sub-components
const NavItem = ({ icon, label, active, isOpen, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {isOpen && <span className="text-sm font-bold tracking-tight">{label}</span>}
  </button>
);

const QuickCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-5 group cursor-pointer">
    <div className={`p-4 bg-${color}-50 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-none">{desc}</p>
    </div>
  </div>
);

export default HospitalDashboard;