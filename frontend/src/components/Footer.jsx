import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, 
  Github, 
  Mail, 
  Heart, 
  ExternalLink, 
  Database, 
  Cpu, 
  Layers, 
  Lock, 
  FileCheck2,
  Sparkles
} from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");

  // Keep dashboard views clean
  if (isDashboard) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020617] border-t border-slate-800/80 text-slate-400 overflow-hidden z-20">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Brand & Author Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Chain</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Decentralized, patient-sovereign healthcare network powered by Ethereum blockchain smart contracts, SHA-256 tamper verification, and high-performance serverless cloud architecture.
            </p>

            {/* Creator / Lead Architect Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 max-w-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Architect & Developer</p>
                <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  Aditya Vijapure
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/adityavijapure"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Profile"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:adityavijapure0508@gmail.com"
                  aria-label="Email Aditya Vijapure"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Network Nodes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/auth/patient" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/auth/doctor" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  Doctor Verification
                </Link>
              </li>
              <li>
                <Link to="/auth/hospital" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  Hospital / Lab Node
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  Role Selector Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Ledger & Security */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Cryptography
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/records" className="hover:text-cyan-400 transition-colors">
                  Ledger Hash Explorer
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-cyan-400 transition-colors">
                  Zero-Knowledge Proofs
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  SHA-256 IPFS Anchoring
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  MetaMask Keypair Signatures
                </span>
              </li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Stack & Specs
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                <span>Frontend</span>
                <span className="font-mono text-slate-300">React 19 + Vite</span>
              </li>
              <li className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                <span>Backend</span>
                <span className="font-mono text-slate-300">Spring Boot 3.4</span>
              </li>
              <li className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                <span>Database</span>
                <span className="font-mono text-slate-300">Neon PostgreSQL</span>
              </li>
              <li className="flex items-center justify-between text-slate-400 py-1">
                <span>Ledger</span>
                <span className="font-mono text-slate-300">Ethereum / Web3j</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="font-medium">
              &copy; {currentYear} <span className="text-slate-200 font-semibold">HealthChain Network</span>. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p className="text-slate-400 flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by{" "}
              <a 
                href="https://github.com/adityavijapure" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline decoration-blue-500/30 underline-offset-2"
              >
                Aditya Vijapure
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Mainnet Active
            </span>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Support
            </Link>
            <span className="text-slate-600">•</span>
            <a 
              href="https://github.com/adityavijapure/Decentralized-Healthcare-Network-using-Blockchain" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
