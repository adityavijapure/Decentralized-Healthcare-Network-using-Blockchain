import React from 'react';
import { 
  ShieldCheckIcon, 
  CpuChipIcon, 
  CloudArrowUpIcon, 
  KeyIcon, 
  ArrowsRightLeftIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const projectFeatures = [
  {
    name: 'Blockchain-Backed Integrity',
    description: 'Every medical record is hashed using SHA-256 and stored on the Ethereum ledger, ensuring an immutable, tamper-proof history of your health data.',
    icon: CpuChipIcon,
  },
  {
    name: 'Patient-Centric Control',
    description: 'You own your data. Use smart contracts to grant or revoke access to doctors and hospitals instantly, putting an end to data fragmentation.',
    icon: UserCircleIcon,
  },
  {
    name: 'End-to-End Encryption',
    description: 'Sensitive files are encrypted using AES-256 before being stored on AWS S3, ensuring that only authorized parties with the correct keys can view them.',
    icon: KeyIcon,
  },
  {
    name: 'Secure Cloud Storage',
    description: 'Leveraging AWS S3 for scalable, high-availability storage of heavy medical files like MRI scans and X-rays, linked securely to the blockchain.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Immutable Audit Logs',
    description: 'Every time a record is accessed, a permanent log is created on the blockchain. Total transparency on who viewed your data and when.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Seamless Interoperability',
    description: 'Eliminate manual paperwork. Share verified medical histories across different healthcare providers within seconds through a unified network.',
    icon: ArrowsRightLeftIcon,
  },
];

const Features = () => {
  return (
    <section className="relative bg-slate-50 py-24 overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
            System Capabilities
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            The Future of Healthcare <span className="text-blue-600">Data Security</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our decentralized network replaces outdated centralized silos with a transparent, 
            secure, and patient-controlled ecosystem powered by Web3 and Cloud technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.name}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;