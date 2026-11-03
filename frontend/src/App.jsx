import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Contact from "./components/contact.jsx";

// Pages
import Features from "./pages/Features.jsx";
import Doctors from "./pages/Doctors.jsx";
import Records from "./pages/Records.jsx";

// Auth Pages
import RoleLanding from "./pages/Landing.jsx";
import PatientAuth from "./pages/auth/PatientAuth.jsx";
import DoctorAuth from "./pages/auth/DoctorAuth.jsx";
import HospitalAuth from "./pages/auth/HospitalAuth.jsx";

// Dashboards
import PatientDashboard from "./pages/dashboards/PatientDashboard.jsx";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard.jsx";
import HospitalDashboard from "./pages/dashboards/HospitalDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar automatically hides on dashboard routes */}
      <Navbar />

      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/records" element={<Records />} />

        {/* Authentication Entry Point */}
        <Route path="/login" element={<RoleLanding />} /> 
        
        {/* Role-Specific Auth Routes (with aliases for robustness) */}
        <Route path="/auth/patient" element={<PatientAuth />} />
        <Route path="/patient/auth" element={<Navigate to="/auth/patient" replace />} />
        
        <Route path="/auth/doctor" element={<DoctorAuth />} />
        <Route path="/doctor/auth" element={<Navigate to="/auth/doctor" replace />} />
        
        <Route path="/auth/hospital" element={<HospitalAuth />} />
        <Route path="/hospital/auth" element={<Navigate to="/auth/hospital" replace />} />

        {/* Dashboard Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
