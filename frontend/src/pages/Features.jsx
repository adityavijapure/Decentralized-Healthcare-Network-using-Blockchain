import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  Key, 
  ArrowRightLeft, 
  UserCheck, 
  Lock, 
  FileCheck, 
  Activity, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Database,
  Fingerprint,
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';

const capabilities = [
  {
    name: 'Blockchain-Backed Integrity',
    description: 'Every medical record is hashed using SHA-256 and stored on the Ethereum ledger, ensuring an immutable, tamper-proof history of your health data.',
    icon: Cpu,
    category: 'Consensus',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Patient-Centric Sovereignty',
    description: 'You own your data. Use smart contracts to grant or revoke access to doctors and hospitals instantly, putting an end to data fragmentation.',
    icon: UserCheck,
    category: 'Permissions',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    name: 'AES-256 End-to-End Encryption',
    description: 'Sensitive files are encrypted locally before transmission and stored on AWS S3, ensuring only parties with authorized private keys can decrypt them.',
    icon: Key,
    category: 'Cryptography',
    color: 'from-purple-500 to-violet-600'
  },
  {
    name: 'High-Throughput Hybrid Storage',
    description: 'Leveraging AWS S3 for scalable, high-availability storage of heavy medical files like MRI scans and X-rays, linked securely to the blockchain via CID hashes.',
    icon: Cloud,
    category: 'Cloud Storage',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    name: 'Immutable Audit Logging',
    description: 'Every time a record is accessed, a permanent cryptographic log is created on the blockchain. Total transparency on who viewed your data and when.',
    icon: ShieldCheck,
    category: 'Auditability',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    name: 'Zero-Friction Interoperability',
    description: 'Eliminate manual paperwork. Share verified medical histories across different healthcare providers within seconds through a unified, standard protocol.',
    icon: ArrowRightLeft,
    category: 'Interoperability',
    color: 'from-pink-500 to-rose-600'
  },
];

const comparisonData = [
  {
    feature: 'Data Ownership',
    traditional: 'Owned by Hospitals & Third Parties',
    healthchain: '100% Owned by the Patient'
  },
  {
    feature: 'Data Portability',
    traditional: 'Physical paperwork, CDs, fax machines',
    healthchain: 'Instant cryptographic cross-provider sharing'
  },
  {
    feature: 'Audit Trail',
    traditional: 'Internal database logs prone to tampering',
    healthchain: 'Immutable Ethereum smart contract logs'
  },
  {
    feature: 'File Security',
    traditional: 'Centralized server breach risk',
    healthchain: 'Client AES-256 encryption + S3 hash anchoring'
  },
  {
    feature: 'Consent Mechanism',
    traditional: 'Static paper forms signed once',
    healthchain: 'Dynamic smart contracts with instant revocation'
  }
];

export default function Features() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Consensus', 'Permissions', 'Cryptography', 'Cloud Storage', 'Auditability', 'Interoperability'];

  const filteredCapabilities = selectedFilter === 'All'
    ? capabilities
    : capabilities.filter(c => c.category === selectedFilter);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pt-32 pb-24 px-6 relative selection:bg-blue-500/30 overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="cyber-glow w-[500px] h-[500px] bg-blue-600/15 top-[5%] left-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-teal-500/15 top-[40%] right-[-10%]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Workflow className="w-3.5 h-3.5" />
            <span>Architecture & Capabilities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            The Future of Healthcare <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
              Data Security & Sovereignty
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg mt-6 leading-relaxed">
            Our decentralized protocol eliminates centralized honeypots with an immutable, transparent, and patient-governed infrastructure powered by Ethereum smart contracts and encrypted S3 storage.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredCapabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-2 group shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cap.color} flex items-center justify-center text-white shadow-lg shadow-black/30 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                    {cap.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {cap.name}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Traditional vs HealthChain */}
        <div className="rounded-[2.5rem] bg-slate-900/60 border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Traditional Healthcare vs. <span className="text-teal-400">HealthChain</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Why decentralized Web3 healthcare architecture fundamentally protects patient rights.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6 font-bold">Protocol Dimension</th>
                  <th className="py-4 px-6 font-bold text-rose-400">Legacy Healthcare Silos</th>
                  <th className="py-4 px-6 font-bold text-teal-400">HealthChain Decentralized Network</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{row.traditional}</span>
                    </td>
                    <td className="py-4 px-6 text-emerald-300 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.healthchain}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:scale-[1.02] transition-transform"
          >
            <span>Launch HealthChain Node</span>
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
