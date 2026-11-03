import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Search, 
  ShieldCheck, 
  Award, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  Star, 
  ArrowRight,
  Filter,
  Sparkles
} from "lucide-react";

const doctorsList = [
  {
    id: 1,
    name: "Dr. Aditi Sharma",
    role: "Cardiologist",
    specialty: "Interventional Cardiology",
    experience: "12+ Years",
    hospital: "Apollo Hospitals",
    license: "MCI-49021-REG",
    rating: 4.9,
    reviews: 142,
    nodeStatus: "Verified Blockchain Node",
    avatarBg: "from-blue-500 to-indigo-600",
    initials: "AS"
  },
  {
    id: 2,
    name: "Dr. Rohan Mehta",
    role: "Neurologist",
    specialty: "Neuro-immunology & Stroke",
    experience: "10+ Years",
    hospital: "Fortis Healthcare",
    license: "MCI-38291-REG",
    rating: 4.8,
    reviews: 98,
    nodeStatus: "Verified Blockchain Node",
    avatarBg: "from-purple-500 to-indigo-600",
    initials: "RM"
  },
  {
    id: 3,
    name: "Dr. Kavya Patel",
    role: "Pediatrician",
    specialty: "Pediatric Critical Care",
    experience: "8+ Years",
    hospital: "AIIMS Delhi",
    license: "MCI-61920-REG",
    rating: 4.9,
    reviews: 185,
    nodeStatus: "Verified Blockchain Node",
    avatarBg: "from-teal-500 to-emerald-600",
    initials: "KP"
  },
  {
    id: 4,
    name: "Dr. Sameer Khan",
    role: "Orthopedic Surgeon",
    specialty: "Joint Replacement & Arthroscopy",
    experience: "15+ Years",
    hospital: "Manipal Hospitals",
    license: "MCI-29104-REG",
    rating: 4.9,
    reviews: 210,
    nodeStatus: "Verified Blockchain Node",
    avatarBg: "from-amber-500 to-rose-600",
    initials: "SK"
  },
  {
    id: 5,
    name: "Dr. Ananya Ray",
    role: "Oncologist",
    specialty: "Precision Genomic Oncology",
    experience: "11+ Years",
    hospital: "Tata Memorial Center",
    license: "MCI-55102-REG",
    rating: 4.9,
    reviews: 130,
    nodeStatus: "Verified Blockchain Node",
    avatarBg: "from-pink-500 to-rose-600",
    initials: "AR"
  },
  {
    id: 6,
    name: "Dr. Vikram Joshi",
    role: "Radiologist",
    specialty: "Diagnostic CT & MRI Imaging",
    experience: "14+ Years",
    hospital: "Max Super Speciality",
    license: "MCI-44192-REG",
    rating: 4.8,
    reviews: 167,
    nodeStatus: "Verified Blockchain Node",
    avatarBg: "from-cyan-500 to-blue-600",
    initials: "VJ"
  }
];

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const roles = ["All", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedic Surgeon", "Oncologist", "Radiologist"];

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesRole = selectedRole === "All" || doc.role === selectedRole;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pt-32 pb-24 px-6 relative selection:bg-blue-500/30 overflow-hidden">
      
      {/* Background Cyber Glows */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="cyber-glow w-[500px] h-[500px] bg-blue-600/15 top-[5%] left-[-10%]" />
      <div className="cyber-glow w-[500px] h-[500px] bg-purple-600/15 top-[40%] right-[-10%]" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>On-Chain Verified Practitioners</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Consult With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
              Licensed Specialists
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg mt-6 leading-relaxed">
            Every practitioner on HealthChain has their medical council credentials cryptographically certified. Share diagnostic reports seamlessly with end-to-end encryption.
          </p>
        </div>

        {/* Search & Specialty Filter Controls */}
        <div className="max-w-4xl mx-auto mb-14 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-4 rounded-2xl bg-slate-900/80 border border-white/10 text-sm text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-500 backdrop-blur-md"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedRole === role
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="group p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Initials Avatar + Verified Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doc.avatarBg} flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-black/40 group-hover:scale-105 transition-transform`}>
                    {doc.initials}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Node</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      {doc.license}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {doc.name}
                </h3>

                <p className="text-teal-400 text-sm font-semibold mb-1">
                  {doc.role}
                </p>

                <p className="text-xs text-slate-400 mb-4">
                  {doc.specialty}
                </p>

                <div className="space-y-2 py-4 border-y border-white/5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Affiliated Hospital:
                    </span>
                    <span className="font-semibold text-white">{doc.hospital}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Experience:
                    </span>
                    <span className="font-semibold text-white">{doc.experience}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Patient Rating:
                    </span>
                    <span className="font-semibold text-white">{doc.rating} / 5.0 ({doc.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-2">
                <Link
                  to="/login"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <span>Request Record Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No specialists found matching your search criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
}
