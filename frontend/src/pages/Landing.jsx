import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

export default function Landing() {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'patient',
      title: 'Patient Portal',
      desc: 'Access your personal health records, upload medical documents, and manage sharing permissions.',
      icon: <UserIcon className="w-10 h-10" />,
      color: 'from-teal-500 to-emerald-600',
      path: '/auth/patient'
    },
    {
      id: 'doctor',
      title: 'Doctor Portal',
      desc: 'Securely request access to patient data, view specialization-filtered records, and track audit logs.',
      icon: <UserGroupIcon className="w-10 h-10" />,
      color: 'from-blue-600 to-indigo-700',
      path: '/auth/doctor'
    },
    {
      id: 'hospital',
      title: 'Hospital / Lab',
      desc: 'Verify patient identities and directly upload medical reports to the decentralized ledger.',
      icon: <BuildingOffice2Icon className="w-10 h-10" />,
      color: 'from-purple-600 to-violet-700',
      path: '/auth/hospital'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 font-sans selection:bg-blue-500/30">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <ShieldCheckIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
          Health<span className="text-blue-500">Chain</span> Network
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Choose your identity to access the decentralized healthcare ecosystem. 
          Secure, private, and blockchain-verified.
        </p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            onClick={() => navigate(portal.path)}
            className="group cursor-pointer relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 hover:border-white/20 hover:bg-slate-900/60 transition-all shadow-2xl"
          >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-[2.5rem]`} />
            
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${portal.color} text-white mb-8 shadow-xl shadow-black/20`}>
              {portal.icon}
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              {portal.title}
            </h2>
            
            <p className="text-slate-400 leading-relaxed mb-8 text-sm font-medium">
              {portal.desc}
            </p>

            <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-white transition-colors">
              Initialize Portal <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-20 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]"
      >
        Verified Blockchain Node v2.0.6
      </motion.footer>
    </div>
  );
}