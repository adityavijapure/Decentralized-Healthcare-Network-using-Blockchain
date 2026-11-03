import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  Activity,
  ArrowUpRight
} from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isDashboard = location.pathname.includes("/dashboard");
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide on dashboard routes
  if (isDashboard) return null;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Ledger Explorer", path: "/records" },
    { label: "Doctors", path: "/doctors" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* BRAND LOGO */}
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-lg hover:border-blue-500/40 transition-all duration-300 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1">
              Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Chain</span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase -mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Decentralized
            </span>
          </div>
        </Link>

        {/* DESKTOP FLOATING NAV BAR */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? "text-white bg-white/10 shadow-inner shadow-white/10" 
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-lg ${
              isLoginPage 
                ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-teal-500/20 hover:brightness-110 ring-2 ring-teal-400/30"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-blue-600/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-95"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoginPage ? "Portals Active" : "Access Portal"}</span>
          </Link>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 text-white hover:bg-slate-900 transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE POPUP MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-7xl mx-auto pointer-events-auto rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl animate-in slide-in-from-top-3 duration-200 flex flex-col gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.label} 
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            );
          })}
          <Link 
            to="/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Healthcare Portal</span>
          </Link>
        </div>
      )}
    </header>
  );
}
