import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Logic: Hide this navbar if the path includes "/dashboard"
  const isDashboard = location.pathname.includes("/dashboard");
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If on a dashboard, don't render this navbar at all
  if (isDashboard) return null;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Records", path: "/records" },
    { label: "Doctors", path: "/doctors" },
    { label: "Contact", path: "/contact" },
  ];

  const navBackground = !isHomePage || scrolled
    ? "bg-slate-950/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
    : "bg-transparent py-5";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBackground}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-6 transition-transform">
            H
          </div>
          <div className="text-xl font-bold text-white tracking-wide">
            Health<span className="text-blue-400">Chain</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-semibold transition-all ${
                location.pathname === link.path ? "text-blue-400" : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* LOGIN BUTTON & MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95"
          >
            Login
          </Link>

          <button 
            className="md:hidden text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-white/10 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              to={link.path} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-blue-600 text-center text-white py-3 rounded-xl font-bold"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}