import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full bg-white font-sans selection:bg-blue-600 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen bg-[#020617] text-white flex items-center pt-20 overflow-hidden">
        
        {/* Ambient Lighting Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Web3-Enabled Healthcare Data Exchange
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              Decentralized <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                HealthChain
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Eliminate data fragmentation with a patient-centric architecture. 
              Secure medical files on AWS S3 while maintaining an immutable audit log and 
              access permissions on the Ethereum blockchain.
            </p>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Unified Access Portal */}
              <Link 
                to="/login" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
              >
                Access Portal
                <i className="fas fa-sign-in-alt text-sm group-hover:translate-x-1 transition-transform"></i>
              </Link>
              
              {/* Unified Registration Node */}
              <Link 
                to="/login" 
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 group border border-emerald-500/20"
              >
                Register Node
                <i className="fas fa-user-plus text-sm group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/50 mt-8">
              <div>
                <h3 className="text-3xl font-bold text-white">AES-256</h3>
                <p className="text-sm text-slate-500 uppercase tracking-tighter">Encryption</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Web3</h3>
                <p className="text-sm text-slate-500 uppercase tracking-tighter">Permissioning</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">S3</h3>
                <p className="text-sm text-slate-500 uppercase tracking-tighter">Cloud Storage</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration Section */}
          <div className="hidden lg:block relative group perspective-1000">
             <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 transform transition-transform duration-500 group-hover:rotate-1">
                <img 
                  src="https://img.freepik.com/free-vector/gradient-technology-futuristic-background_23-2149122416.jpg" 
                  alt="Blockchain Technology Illustration" 
                  className="w-full h-auto object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
             </div>

             {/* Floating Security Badge */}
             <div className="absolute -bottom-6 -left-6 z-20 bg-slate-800/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-600 shadow-xl animate-bounce-slow">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xl">
                   <i className="fas fa-link"></i>
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Blockchain Status</p>
                   <p className="text-white font-bold">Ethereum Mainnet Sync</p>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES PREVIEW --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0B1F44]">Transforming Healthcare Interoperability</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We leverage modern enterprise technologies to empower patients with full ownership and control over their medical history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-6">
                <i className="fas fa-fingerprint"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Immutable Audit Logs</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Blockchain provides a permanent record of every access request and file modification, ensuring complete transparency.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-6">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scalable Cloud Storage</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Medical scans and lab reports are stored securely in encrypted form on AWS S3, linked via immutable hashes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-6">
                <i className="fas fa-user-check"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patient-Centric Control</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Patients grant or revoke access to specific doctors or labs using decentralized smart contracts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;