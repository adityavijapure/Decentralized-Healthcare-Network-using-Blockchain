import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Contact from "./components/contact.jsx";

// Pages
import Features from "./pages/Features.jsx";
import Doctors from "./pages/Doctors.jsx";
import Records from "./pages/Records.jsx";

// Auth Pages (Updated Paths)
import RoleLanding from "./pages/Landing.jsx"; // Create this for role selection
import PatientAuth from "./pages/auth/PatientAuth.jsx";
import DoctorAuth from "./pages/auth/DoctorAuth.jsx";
import HospitalAuth from "./pages/auth/HospitalAuth.jsx";

// Dashboards (Updated Paths)
import PatientDashboard from "./pages/dashboards/PatientDashboard.jsx";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard.jsx";
import HospitalDashboard from "./pages/dashboards/HospitalDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar will automatically hide on dashboard routes if 
          you used the logic we added to Navbar.jsx */}
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
        
        {/* Role-Specific Auth Routes */}
        <Route path="/auth/patient" element={<PatientAuth />} />
        <Route path="/auth/doctor" element={<DoctorAuth />} />
        <Route path="/auth/hospital" element={<HospitalAuth />} />

        {/* Dashboard Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;