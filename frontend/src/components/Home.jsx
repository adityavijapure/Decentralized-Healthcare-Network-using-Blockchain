import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  Cloud, 
  Cpu, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Fingerprint, 
  Users, 
  Building2, 
  FileText, 
  Layers, 
  Zap, 
  Database, 
  KeyRound, 
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const architectureSteps = [
    {
      step: "01",
      title: "Patient Encrypts & Signs",
      desc: "Medical records (PDFs, scans, MRIs) are encrypted locally using AES-256 before leaving the user device.",
      icon: Lock,
      color: "from-teal-500 to-emerald-500",
      accent: "text-teal-400"
    },
    {
      step: "02",
      title: "Encrypted Cloud Storage",
      desc: "The encrypted file payload is stored securely on AWS S3 with an immutable SHA-256 fingerprint hash.",
      icon: Cloud,
      color: "from-blue-500 to-indigo-500",
      accent: "text-blue-400"
    },
    {
      step: "03",
      title: "Smart Contract Permission",
      desc: "The document CID and access rights are registered permanently onto the Ethereum/Sepolia smart contract.",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      accent: "text-indigo-400"
    },
    {
      step: "04",
      title: "Doctor Decrypts With Consent",
      desc: "Authorized medical specialists use their registered MetaMask signature to request and decrypt clinical records.",
      icon: ShieldCheck,
      color: "from-purple-500 to-pink-500",
      accent: "text-purple-400"
    }
  ];

  const features = [
    {
      title: "Patient-Controlled Access",
      desc: "Grant or instantly revoke medical record access to any physician or clinic globally via smart contract rules.",
      icon: Fingerprint,
      tag: "Self-Sovereign"
    },
    {
      title: "Immutable Audit History",
      desc: "Every decryption request, view timestamp, and record upload is immortalized on-chain. Zero hidden surveillance.",
      icon: Layers,
      tag: "100% Transparent"
    },
    {
      title: "Scalable Hybrid Storage",
      desc: "Decouples heavy multi-gigabyte diagnostic images on AWS S3 from cryptographic hashes on the Ethereum ledger.",
      icon: Database,
      tag: "AWS S3 + Web3"
    },
    {
      title: "Role-Based Cryptography",
      desc: "Distinct authorization protocols tailored for Patients, Licensed Medical Practitioners, and Diagnostic Labs.",
      icon: KeyRound,
      tag: "Zero-Knowledge"
    },
    {
      title: "No Data Silos",
      desc: "Eliminates faxing, duplicate physical paperwork, and fragmented hospital databases with a unified ledger.",
      icon: Zap,
      tag: "Interoperable"
    },
    {
      title: "Tamper-Proof Verification",
      desc: "Verify any medical certificate or diagnostic report hash in real-time to detect document counterfeiting.",
      icon: ShieldCheck,
      tag: "Cryptographic Proof"
    }
  ];

  return (
    <div className="w-full bg-[#030712] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
        <div className="cyber-glow w-[600px] h-[600px] bg-blue-600/25 top-[-10%] right-[-5%]" />
        <div className="cyber-glow w-[500px] h-[500px] bg-teal-500/20 bottom-[10%] left-[-10%]" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span className="text-xs font-bold text-blue-300 tracking-wide uppercase">
                Next-Gen Healthcare Protocol v2.4
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Decentralized <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
                Healthcare Ledger
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Eliminate data fragmentation and surveillance. Secure medical files on 
              high-speed AWS S3 while maintaining an immutable, patient-owned audit log 
              governed by Ethereum smart contracts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/login" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <span>Enter Healthcare Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/records" 
                className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Explore Public Ledger</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </Link>
            </div>

            {/* Live Metrics Ticker */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/80 mt-10">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">AES-256</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Client Encryption</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">100%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Patient Sovereignty</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">AWS + Web3</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Hybrid Architecture</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Holographic Node Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full rounded-[2.5rem] bg-gradient-to-b from-slate-800/60 to-slate-900/90 border border-white/10 p-6 shadow-2xl backdrop-blur-2xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Node Verification</h3>
                    <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">Ethereum Consensus Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </div>
              </div>

              {/* Dynamic Simulated Block Record */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Record Digest (CID):</span>
                    <span className="text-teal-300 font-mono text-[11px]">0x7f9a...88b2</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Storage Provider:</span>
                    <span className="text-white font-medium">AWS S3 (Encrypted)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Consent State:</span>
                    <span className="text-emerald-400 font-semibold">Active Doctor Lease</span>
                  </div>
                </div>

                {/* Simulated Verification Pipeline */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      Client Key Handshake
                    </span>
                    <span className="text-emerald-400 font-bold">Passed</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      Smart Contract Verification
                    </span>
                    <span className="text-emerald-400 font-bold">Confirmed</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5">
                    <span className="text-slate-300 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      Decrypted Medical Digest
                    </span>
                    <span className="text-blue-400 font-bold">Authorized</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Authorize Identity Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- ARCHITECTURE FLOW SECTION --- */}
      <section className="py-24 px-6 border-t border-slate-800/80 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3 block">
              Cryptographic Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              How Your Health Data Stays <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">100% Private</span>
            </h2>
            <p className="text-slate-400 text-base mt-4">
              We never store unencrypted health files on a central database. Here is how our hybrid Web3 architecture guarantees zero unauthorized access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {architectureSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-2 relative group"
                >
                  <span className="text-3xl font-black text-slate-800 group-hover:text-slate-700 transition-colors absolute top-6 right-6">
                    {item.step}
                  </span>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-black/30 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- PROTOCOL FEATURES GRID --- */}
      <section className="py-24 px-6 relative border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3 block">
              Enterprise Grade Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Transforming Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Interoperability</span>
            </h2>
            <p className="text-slate-400 text-base mt-4">
              A modern decentralized ecosystem built to meet strict medical confidentiality standards while empowering seamless sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={index}
                  className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- READY TO GET STARTED CTA --- */}
      <section className="py-20 px-6 border-t border-slate-800/80 relative">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-blue-900/40 via-indigo-950/60 to-slate-900 border border-blue-500/30 p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          
          <div className="cyber-glow w-[400px] h-[400px] bg-teal-500/20 top-[-20%] left-[-20%]" />
          <div className="cyber-glow w-[400px] h-[400px] bg-blue-500/20 bottom-[-20%] right-[-20%]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Own Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Medical Records?
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of patients, certified specialists, and hospital diagnostic laboratories on the HealthChain Network.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-black rounded-2xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Portal Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-4 bg-slate-900/80 border border-white/10 hover:border-white/20 text-white font-bold rounded-2xl transition-all flex items-center justify-center"
              >
                <span>Contact Hospital Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
