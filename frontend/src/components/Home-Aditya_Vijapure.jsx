import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full bg-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen bg-[#020617] text-white flex items-center pt-20 overflow-hidden">
        
        {/* Background Gradients/Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide uppercase">
              🚀 The Future of Medical Records
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              Decentralized <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Healthcare
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Secure, transparent, and immutable patient data powered by Blockchain technology. 
              Give patients control over their records while ensuring instant access for doctors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/patient-login"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                Patient Login <i className="fas fa-arrow-right text-sm"></i>
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700 flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>

            {/* Stats */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/50 mt-8">
              <div>
                <h3 className="text-3xl font-bold text-white">100%</h3>
                <p className="text-sm text-slate-500">Secure</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">24/7</h3>
                <p className="text-sm text-slate-500">Access</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">0s</h3>
                <p className="text-sm text-slate-500">Downtime</p>
              </div>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="hidden lg:block relative">
             <img 
               src="https://img.freepik.com/free-vector/gradient-technology-futuristic-background_23-2149122416.jpg" 
               alt="Blockchain Tech" 
               className="w-full rounded-3xl shadow-2xl border border-slate-700/50 hover:scale-[1.02] transition duration-500"
             />
             {/* Floating Badge */}
             <div className="absolute -bottom-10 -left-10 bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                   <i className="fas fa-shield-alt text-xl"></i>
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs uppercase">Security Status</p>
                   <p className="text-white font-bold">Encrypted & Safe</p>
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
            <h2 className="text-3xl font-bold text-[#0B1F44]">Why Choose HealthChain?</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We replace outdated paper records with a unified, digital, and cryptographically secure system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-6">
                <i className="fas fa-database"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Immutable Records</h3>
              <p className="text-gray-600 leading-relaxed">
                Once data is written to the blockchain, it cannot be altered or deleted, ensuring a permanent history.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-6">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patient Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Patients own their private keys. No doctor or hospital can view data without explicit permission.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-6">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Retrieve medical history in seconds from anywhere in the world, eliminating administrative delays.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;