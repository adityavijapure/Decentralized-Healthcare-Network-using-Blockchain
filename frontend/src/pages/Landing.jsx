import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  User, 
  Stethoscope, 
  Building2, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  FileCheck2, 
  Activity, 
  CheckCircle2, 
  HelpCircle,
  X,
  ExternalLink,
  Cpu
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const portals = [
    {
      id: 'patient',
      badge: 'Self-Sovereign Identity',
      title: 'Patient Portal',
      subtitle: 'Complete ownership of your medical records',
      desc: 'Encrypt, store, and manage your lifetime clinical records. Grant or revoke doctor access on-demand using smart contracts.',
      icon: User,
      colorName: 'teal',
      glowColor: 'rgba(20, 184, 166, 0.25)',
      borderColor: 'border-teal-500/30 hover:border-teal-400/80',
      tagBg: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
      btnGradient: 'from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold',
      path: '/auth/patient',
      highlights: ['Decentralized Medical ID', 'Smart Contract Permissions', 'AWS S3 Encrypted']
    },
    {
      id: 'doctor',
      badge: 'Verified Practitioner',
      title: 'Doctor Portal',
      subtitle: 'Decentralized clinical consultation hub',
      desc: 'Request cryptographic access to patient health files, review specialization-filtered diagnostics, and verify immutable audit histories.',
      icon: Stethoscope,
      colorName: 'blue',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      borderColor: 'border-blue-500/30 hover:border-blue-400/80',
      tagBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      btnGradient: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold',
      path: '/auth/doctor',
      highlights: ['Instant Permission Requests', 'End-to-End File Decryption', 'Immutable Audit Trails']
    },
    {
      id: 'hospital',
      badge: 'Institutional Node',
      title: 'Hospital & Lab',
      subtitle: 'Certified diagnostic report minting',
      desc: 'Authenticate incoming patients, upload verified laboratory diagnostics directly to AWS S3, and anchor file hashes to Ethereum.',
      icon: Building2,
      colorName: 'purple',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      borderColor: 'border-purple-500/30 hover:border-purple-400/80',
      tagBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      btnGradient: 'from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold',
      path: '/auth/hospital',
      highlights: ['Lab Report Anchoring', 'Proof of Authority Setup', 'Zero Tampering Guarantee']
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-between pt-24 pb-12 font-sans selection:bg-blue-500/30">
      
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/70 to-[#030712] pointer-events-none" />

      {/* Atmospheric Glow Orbs */}
      <div className="cyber-glow w-[550px] h-[550px] bg-blue-600/20 top-[-10%] left-[-10%]" />
      <div className="cyber-glow w-[600px] h-[600px] bg-teal-500/15 top-[30%] right-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-purple-600/20 bottom-[-10%] left-[25%]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full my-auto">
        
        {/* Top Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          {/* Protocol Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl mb-6 shadow-inner shadow-white/5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              Web3 Decentralized Health Identity Hub
            </span>
            <button 
              onClick={() => setShowHowItWorks(true)}
              className="ml-1 text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs font-bold transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How it works</span>
            </button>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-5">
            Select Your Portal to Enter{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
              HealthChain
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Choose your role to access decentralized healthcare records. 
            All permissions, document hashes, and access logs are cryptographic and permanently verifiable on-chain.
          </p>
        </motion.div>

        {/* The 3 Modern Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                onClick={() => navigate(portal.path)}
                className={`group relative flex flex-col justify-between p-8 rounded-[2rem] bg-slate-900/60 backdrop-blur-xl border ${portal.borderColor} cursor-pointer transition-all duration-300 shadow-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]`}
                style={{
                  boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`
                }}
              >
                {/* Radial Hover Gradient Lighting */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${portal.glowColor}, transparent 70%)`
                  }}
                />

                {/* Card Top */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-slate-800/80 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${portal.tagBg}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-blue-200 transition-colors">
                    {portal.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-400 mb-4">
                    {portal.subtitle}
                  </p>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                    {portal.desc}
                  </p>

                  {/* Highlights Tags */}
                  <div className="space-y-2 mb-8">
                    {portal.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="relative z-10 pt-4 border-t border-white/5">
                  <div className={`w-full py-3.5 px-5 rounded-xl bg-gradient-to-r ${portal.btnGradient} flex items-center justify-center gap-2 text-sm tracking-wide transition-all duration-200 shadow-lg group-hover:shadow-xl group-hover:gap-3`}>
                    <span>Initialize Portal</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Network Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 max-w-4xl mx-auto rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 backdrop-blur-md"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <p className="text-xs text-slate-500 uppercase font-semibold">Ledger Protocol</p>
              <p className="text-sm font-bold text-white mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Ethereum / Sepolia
              </p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-xs text-slate-500 uppercase font-semibold">File Encryption</p>
              <p className="text-sm font-bold text-white mt-1">AES-256 + S3</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-xs text-slate-500 uppercase font-semibold">Smart Contracts</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">Audited & Verified</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-xs text-slate-500 uppercase font-semibold">Data Sovereignty</p>
              <p className="text-sm font-bold text-white mt-1">100% Patient Owned</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer System Status */}
      <div className="relative z-10 text-center mt-8 text-xs text-slate-500 font-medium">
        <span>Decentralized Healthcare Network Node v2.4.0 • Zero-Knowledge Data Privacy</span>
      </div>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl text-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">How HealthChain Works</h3>
                    <p className="text-xs text-slate-400">Web3 Healthcare Architecture</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHowItWorks(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-semibold text-white">Self-Sovereign Identity</p>
                    <p className="text-xs text-slate-400 mt-0.5">Connect via MetaMask or email to anchor your digital healthcare wallet on the blockchain.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-semibold text-white">Encrypted Cloud Storage</p>
                    <p className="text-xs text-slate-400 mt-0.5">Heavy files (MRIs, Blood tests, scans) are encrypted using AES-256 and safely stored in AWS S3 buckets.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-semibold text-white">Cryptographic Access Control</p>
                    <p className="text-xs text-slate-400 mt-0.5">Smart contracts handle doctor access permissions. You have full power to revoke access anytime.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg"
              >
                Got it, Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
