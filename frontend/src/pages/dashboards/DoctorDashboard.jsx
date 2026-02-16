import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Key, Users, ClipboardList, 
  Search, Eye, Trash2, Bell, Menu, X, ShieldAlert,
  ChevronDown, Activity, Heart
} from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');

  // Simulation: Logged-in Doctor Data with Specialization
  const doctor = {
    name: "Dr. Anil Sharma",
    email: "anil.sharma@healthchain.io",
    role: "Doctor",
    specialization: "Cardiologist", // Heart Expert
    avatarInitial: "AS"
  };

  // Sample Data: Patient Records with Categories
  const allPatientRecords = [
    { id: 1, name: "MRI Brain Scan", patient: "John Patel", date: "2 Feb 2026", access: 4, category: "Neurology" },
    { id: 2, name: "ECG Report - Acute", patient: "John Patel", date: "03 Feb 2026", access: 2, category: "Cardiology" },
    { id: 3, name: "X-Ray Chest", patient: "John Patel", date: "01 Feb 2026", access: 3, category: "General" },
    { id: 4, name: "Cardiac Stress Test", patient: "Sarah Miller", date: "24 Jan 2026", access: 1, category: "Cardiology" },
  ];

  // COMPLEX LOGIC: Access Control Filter
  // Only records matching the doctor's specialization or 'General' are accessible
  const accessibleRecords = allPatientRecords.filter(record => {
    if (doctor.specialization === "Cardiologist") {
      return record.category === "Cardiology" || record.category === "General";
    }
    return record.category === "General";
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1e293b] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Activity size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">HealthChain</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} isOpen={isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Key size={20} />} label="Request Access" active={activeTab === 'requests'} isOpen={isSidebarOpen} onClick={() => setActiveTab('requests')} />
          <NavItem icon={<ClipboardList size={20} />} label="Audit Logs" active={activeTab === 'logs'} isOpen={isSidebarOpen} onClick={() => setActiveTab('logs')} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* DOCTOR IDENTITY HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Doctor Portal</h2>
               <p className="text-lg font-bold text-slate-800 mt-1">{doctor.specialization} View</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex flex-col items-end border-r pr-5 border-slate-200">
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
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-4">
            <ShieldAlert className="text-amber-600 mt-1" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-800">Specialization-Based Access Active</p>
              <p className="text-xs text-amber-700">As a {doctor.specialization}, you are currently restricted to viewing Heart-related data and General records only.</p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickCard icon={<Key className="text-indigo-600" />} title="Request Access" desc="Search patient by email" color="indigo" />
            <QuickCard icon={<Users className="text-blue-600" />} title="View Shared Data" desc={`${accessibleRecords.length} records available`} color="blue" />
            <QuickCard icon={<ClipboardList className="text-slate-600" />} title="Audit Logs" desc="Track your access history" color="slate" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* REQUEST FORM */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 h-fit">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Request Patient Records</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Patient Email</label>
                  <input 
                    type="email" 
                    placeholder="john.patel@email.com" 
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Request Type</label>
                  <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none">
                    <option>Full Medical History</option>
                    <option>Diagnostic Reports Only</option>
                    <option>Prescription History</option>
                  </select>
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                  Send Access Request
                </button>
              </div>
            </div>

            {/* ACCESSIBLE RECORDS TABLE */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Shared Patient Records</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" placeholder="Filter records..." className="pl-9 pr-4 py-1.5 bg-slate-50 rounded-lg text-xs outline-none border border-slate-100" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Record Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accessibleRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{record.name}</span>
                            <span className="text-[10px] text-slate-400 italic">Patient: {record.patient}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${record.category === 'Cardiology' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                            {record.category === 'Cardiology' && <Heart size={10} />}
                            {record.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">View</button>
                            <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
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
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    {icon}
    {isOpen && <span className="text-sm font-semibold">{label}</span>}
  </button>
);

const QuickCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group cursor-pointer">
    <div className={`p-4 bg-${color}-50 rounded-2xl`}>{icon}</div>
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
    </div>
  </div>
);

export default DoctorDashboard;