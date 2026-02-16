import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, UserGroupIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const RoleSelector = ({ onSelect }) => {
  const roles = [
    { id: 'patient', title: 'Patient', icon: <UserIcon className="w-12 h-12" />, color: 'from-teal-500 to-emerald-600' },
    { id: 'doctor', title: 'Doctor', icon: <UserGroupIcon className="w-12 h-12" />, color: 'from-blue-600 to-indigo-700' },
    { id: 'hospital', title: 'Hospital / Lab', icon: <BuildingOffice2Icon className="w-12 h-12" />, color: 'from-purple-600 to-violet-700' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-6">
      {roles.map((role) => (
        <motion.div
          key={role.id}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(role.id)}
          className="cursor-pointer bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-white/30 transition-all"
        >
          <div className={`bg-gradient-to-br ${role.color} p-5 rounded-2xl mb-6 shadow-lg shadow-black/20`}>
            {role.icon}
          </div>
          <h3 className="text-2xl font-black text-white mb-2">{role.title} Portal</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Authorized access for verified {role.id} nodes on the blockchain network.
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default RoleSelector;