package com.backend.backend.controller;

import com.backend.backend.dto.request.HospitalLoginRequest;
import com.backend.backend.dto.request.HospitalSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.Hospital;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.entity.Patient;
import com.backend.backend.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospital")
@CrossOrigin(origins = "http://localhost:5173")
public class HospitalController {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Hospital> registerHospital(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("hospitalName") String hospitalName,
            @RequestParam(value = "estYear", required = false, defaultValue = "2000") String estYear,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam(value = "councilReg", required = false, defaultValue = "State Medical Registry") String councilReg,
            @RequestParam(value = "walletAddress", required = false) String walletAddress,
            @RequestParam("regCert") MultipartFile regCert,
            @RequestParam(value = "hospitalLogo", required = false) MultipartFile hospitalLogo) {

        HospitalSignupRequest request = new HospitalSignupRequest(
                hospitalName, email, password, estYear, licenseNumber, councilReg, walletAddress
        );

        Hospital hospital = hospitalService.register(request, regCert, hospitalLogo);
        return ResponseEntity.ok(hospital);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody HospitalLoginRequest request) {
        AuthResponse response = hospitalService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<Hospital> getHospitalProfile(@PathVariable String email) {
        Hospital hospital = hospitalService.getHospitalProfile(email);
        return ResponseEntity.ok(hospital);
    }

    @PutMapping("/wallet")
    public ResponseEntity<String> updateWallet(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String walletAddress = payload.get("walletAddress");
        if (email == null || walletAddress == null) {
            return ResponseEntity.badRequest().body("Email and walletAddress are required");
        }
        hospitalService.updateHospitalWallet(email, walletAddress);
        return ResponseEntity.ok("Hospital wallet updated successfully");
    }

    @GetMapping("/verify-patient/{email}")
    public ResponseEntity<Patient> verifyPatient(@PathVariable String email) {
        Patient patient = hospitalService.verifyPatient(email);
        return ResponseEntity.ok(patient);
    }

    @PostMapping("/verify-doctor/{doctorId}")
    public ResponseEntity<Doctor> verifyDoctor(@PathVariable Long doctorId) {
        Doctor doctor = hospitalService.verifyDoctor(doctorId);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<MedicalRecord>> getAllUploadedReports() {
        List<MedicalRecord> reports = hospitalService.getAllUploadedReports();
        return ResponseEntity.ok(reports);
    }
}
