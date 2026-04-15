import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileUp, FolderOpen, ShieldCheck, 
  Search, Trash2, Eye, Menu, X, UploadCloud, ChevronDown, LogOut
} from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // --- STATE FOR USER DATA ---
  const [user, setUser] = useState({
    email: "Loading...",
    fullname: "Patient User",
    role: "Patient",
    avatarInitial: "P"
  });

  useEffect(() => {
    // Retrieve data saved during Login/Signup
    const savedEmail = localStorage.getItem("userEmail");
    const savedName = localStorage.getItem("userFullname") || "Patient User";
    
    if (savedEmail) {
      setUser({
        email: savedEmail,
        fullname: savedName,
        role: "Patient",
        avatarInitial: savedName.charAt(0).toUpperCase()
      });
    } else {
      // If no email found, redirect back to login
      navigate('/patient/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear(); // Wipe the email and session
    navigate('/patient/auth');
  };

  const records = [
    { id: 1, name: "MRI Brain Scan", date: "06 Feb 2026", access: 3, type: "PDF" },
    { id: 2, name: "Blood Test Report", date: "03 Feb 2026", access: 2, type: "JPG" },
    { id: 3, name: "X-Ray Chest", date: "02 Feb 2026", access: 3, type: "PNG" },
    { id: 4, name: "Prescription Notes", date: "22 Jan 2026", access: 1, type: "PDF" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1e293b] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-500 p-2 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight text-white">HealthChain</span>}
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
            icon={<FolderOpen size={20} />} 
            label="My Medical Files" 
            active={activeTab === 'files'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('files')} 
          />
          <NavItem 
            icon={<ShieldCheck size={20} />} 
            label="Access Requests" 
            active={activeTab === 'requests'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('requests')} 
          />
          
          {/* Logout Button in Sidebar for mobile/quick access */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all mt-10"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:block">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Portal</h2>
               <p className="text-lg font-bold text-slate-800 capitalize leading-tight">{activeTab}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block mr-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search records..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none w-64" />
            </div>

            {/* DYNAMIC EMAIL & NAME SECTION */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    {user.role}
                  </span>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{user.fullname}</p>
                </div>
                <p className="text-xs text-slate-500 font-medium">{user.email}</p>
              </div>

              {/* Avatar with dynamic Initial */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 ring-2 ring-white">
                {user.avatarInitial}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickCard icon={<FileUp className="text-blue-600" />} title="Upload Records" desc="Add new medical documents" color="blue" />
            <QuickCard icon={<FolderOpen className="text-indigo-600" />} title="My Medical Files" desc="View 24 saved records" color="indigo" />
            <QuickCard icon={<ShieldCheck className="text-emerald-600" />} title="Access Requests" desc="5 pending doctor requests" color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6">Upload New Record</h3>
              <form className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Record Title</label>
                  <input type="text" placeholder="e.g. Annual Blood Test" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors group cursor-pointer">
                  <UploadCloud className="text-slate-300 group-hover:text-blue-500 transition-colors mb-3" size={40} />
                  <p className="text-sm font-medium text-slate-600">Drag & Drop</p>
                </div>
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                  <FileUp size={18} /> Upload to Blockchain
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">My Medical Files</h3>
                <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">File Name</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Access</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700 text-sm">{record.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{record.access} Viewers</span></td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                          <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
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
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {isOpen && <span className="text-sm font-semibold">{label}</span>}
  </button>
);

const QuickCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 group cursor-pointer">
    <div className={`p-4 bg-${color}-50 rounded-2xl group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
    </div>
  </div>
);

export default PatientDashboard;