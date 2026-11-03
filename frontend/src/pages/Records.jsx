import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  ExternalLink, 
  Hash, 
  Lock, 
  Clock, 
  Fingerprint,
  ArrowRight,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Records() {
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [testHash, setTestHash] = useState('');

  // Sample on-chain verified records for demonstration
  const sampleLedgerRecords = [
    {
      id: "REC-9082",
      cid: "0x7a89f3c1d2e5b4a098124ef5a7c29d0e14a6b8c9d2f1e3a5",
      type: "Comprehensive Metabolic Panel",
      timestamp: "12 mins ago",
      issuer: "City Hospital & Diagnostics",
      blockNumber: "19834210",
      status: "Anchored & Immutable",
      encryption: "AES-256-GCM"
    },
    {
      id: "REC-9081",
      cid: "0x4b12c8e9f0a3d5b76123498a123f8c7d6e5a4b3c2d1e0f9a",
      type: "Cardiovascular MRI High-Res Scan",
      timestamp: "45 mins ago",
      issuer: "Apollo Medical Institute",
      blockNumber: "19834195",
      status: "Anchored & Immutable",
      encryption: "AES-256-GCM"
    },
    {
      id: "REC-9080",
      cid: "0x9c34d5e6f7a8b9c01234567890abcdef1234567890abcdef",
      type: "Genetic Screening & Toxicology",
      timestamp: "2 hours ago",
      issuer: "AIIMS Genomic Laboratory",
      blockNumber: "19834150",
      status: "Anchored & Immutable",
      encryption: "AES-256-GCM"
    },
    {
      id: "REC-9079",
      cid: "0x3f5a7b9c1d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e",
      type: "Chest Computed Tomography (CT)",
      timestamp: "5 hours ago",
      issuer: "Fortis Healthcare Center",
      blockNumber: "19834080",
      status: "Anchored & Immutable",
      encryption: "AES-256-GCM"
    }
  ];

  const handleVerify = (e) => {
    e.preventDefault();
    if (!testHash.trim()) return;

    // Simulate cryptographic verification
    setVerificationResult({
      hash: testHash,
      valid: true,
      blockNumber: "19834212",
      anchorNetwork: "Ethereum Sepolia (ChainID: 11155111)",
      timestamp: "Verified Just Now",
      storageProof: "AWS S3 Multi-Region Hash Matched"
    });
  };

  const filteredRecords = sampleLedgerRecords.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pt-32 pb-24 px-6 relative selection:bg-blue-500/30 overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="cyber-glow w-[550px] h-[550px] bg-blue-600/15 top-[5%] right-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-teal-500/15 top-[40%] left-[-10%]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Public Blockchain Ledger Explorer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Cryptographic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400">
              Record Verification
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg mt-6 leading-relaxed">
            Every clinical document stored on HealthChain has an immutable cryptographic hash anchored to the Ethereum blockchain. Verify proof-of-existence without exposing sensitive medical data.
          </p>
        </div>

        {/* Live Verifier Tool Card */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-2xl backdrop-blur-xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Instant Hash Integrity Checker</h3>
              <p className="text-xs text-slate-400">Test any SHA-256 or document CID to confirm on-chain anchoring</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Enter document hash or CID (e.g. 0x7a89f3c1d2e5b4a098...)"
                value={testHash}
                onChange={(e) => setTestHash(e.target.value)}
                className="w-full py-4 pl-12 pr-28 rounded-2xl bg-slate-950/80 border border-white/10 text-white text-sm outline-none focus:border-teal-400/60 focus:ring-4 focus:ring-teal-500/10 transition-all font-mono placeholder:font-sans placeholder:text-slate-500"
              />
              <Hash className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Verify
              </button>
            </div>
          </form>

          {verificationResult && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Document Integrity Verified on Blockchain</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Anchor Network:</span>
                  <span className="font-semibold text-white">{verificationResult.anchorNetwork}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Block Height:</span>
                  <span className="font-semibold text-white">#{verificationResult.blockNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Storage Handshake:</span>
                  <span className="font-semibold text-teal-300">{verificationResult.storageProof}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className="font-semibold text-emerald-400">Tamper-Proof Confirmed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ledger Records Explorer Table */}
        <div className="rounded-[2.5rem] bg-slate-900/50 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-400" />
                <span>Recent Anchored Health Transactions</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Live verifiable transactions processed on the decentralized health ledger</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter ledger records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4 font-bold">Record ID & Title</th>
                  <th className="py-4 px-4 font-bold">Cryptographic CID</th>
                  <th className="py-4 px-4 font-bold">Issuer Node</th>
                  <th className="py-4 px-4 font-bold">Block</th>
                  <th className="py-4 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{item.type}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id} • {item.timestamp}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-teal-300 max-w-xs truncate" title={item.cid}>
                        {item.cid}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">{item.encryption}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-300">
                      {item.issuer}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">
                      #{item.blockNumber}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              Showing {filteredRecords.length} blockchain-anchored cryptographic records.
            </div>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Login to decrypt and manage your personal files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
