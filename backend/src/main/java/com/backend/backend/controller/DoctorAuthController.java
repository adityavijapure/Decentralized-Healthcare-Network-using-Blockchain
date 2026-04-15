package com.backend.backend.controller;

import com.backend.backend.model.Doctor;
import com.backend.backend.repository.DoctorRepository;
import com.backend.backend.model.MedicalRecord; // Ensure you have this
import com.backend.backend.repository.RecordRepository; // Ensure you have this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;

@RestController
// Changed to /api/doctor to cover both Auth and Dashboard actions
@RequestMapping("/api/doctor") 
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorAuthController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> register(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("fullname") String fullname,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam("regYear") String regYear,
            @RequestParam("medicalCouncil") String medicalCouncil,
            @RequestParam("specialization") String specialization,
            @RequestParam("walletAddress") String walletAddress,
            @RequestParam(value = "proofFile", required = false) MultipartFile proofFile) {

        if (doctorRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        Doctor doctor = new Doctor();
        doctor.setEmail(email);
        doctor.setFullname(fullname);
        doctor.setPassword(passwordEncoder.encode(password));
        doctor.setLicenseNumber(licenseNumber);
        doctor.setRegYear(regYear);
        doctor.setMedicalCouncil(medicalCouncil);
        doctor.setSpecialization(specialization);
        
        String simulatedHash = "DrVerify-" + UUID.randomUUID().toString().substring(0, 20);
        doctor.setValidityHash(simulatedHash);
        doctor.setStatus("AUTHORIZED_NODE");

        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
    String email = credentials.get("email");
    String password = credentials.get("password");

    // 1. Find the doctor by email
    java.util.Optional<Doctor> doctorOpt = doctorRepository.findByEmail(email);

    // 2. Check if doctor exists and password matches
    if (doctorOpt.isPresent() && passwordEncoder.matches(password, doctorOpt.get().getPassword())) {
        Doctor doctor = doctorOpt.get();
        
        // 3. Create a clean response map for React
        Map<String, Object> response = new HashMap<>();
        response.put("email", doctor.getEmail());
        response.put("fullname", doctor.getFullname()); // FIXED: Added 'get' and capitalized 'F'
        response.put("specialization", doctor.getSpecialization());
        response.put("status", doctor.getStatus());
        
        return ResponseEntity.ok(response);
    }

    // 4. Return error if authentication fails
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
}
    // --- DASHBOARD ENDPOINTS ---

    // 1. Fetch records (Simulated: showing all records for now)
    @GetMapping("/records/{email}")
    public List<MedicalRecord> getAccessibleRecords(@PathVariable String email) {
        // In a real blockchain, you'd filter by access rights. 
        // For now, we return all records to check if the connection works.
        return recordRepository.findAll();
    }

    // 2. Handle Access Requests
    @PostMapping("/request-access")
    public ResponseEntity<?> requestAccess(@RequestBody Map<String, String> request) {
        String patientEmail = request.get("patientEmail");
        String doctorEmail = request.get("doctorEmail");
        
        System.out.println("Access Request broadcasted to Blockchain for Patient: " + patientEmail);
        
        // Simulating a successful blockchain broadcast
        return ResponseEntity.ok("Request broadcasted to the network.");
    }
}