package com.backend.backend.controller;

import com.backend.backend.dto.request.AccessRequestDto;
import com.backend.backend.dto.request.DoctorLoginRequest;
import com.backend.backend.dto.request.DoctorSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.dto.response.DoctorResponseDto;
import com.backend.backend.entity.AccessPermission;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorAuthController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorAuthController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Doctor> register(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("fullname") String fullname,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam(value = "regYear", required = false, defaultValue = "2024") String regYear,
            @RequestParam(value = "medicalCouncil", required = false, defaultValue = "General Medical Council") String medicalCouncil,
            @RequestParam("specialization") String specialization,
            @RequestParam(value = "walletAddress", required = false) String walletAddress,
            @RequestParam(value = "proofFile", required = false) MultipartFile proofFile) {

        DoctorSignupRequest request = new DoctorSignupRequest(
                fullname, email, password, licenseNumber, regYear, medicalCouncil, specialization, walletAddress
        );

        Doctor doctor = doctorService.register(request, proofFile);
        return ResponseEntity.ok(doctor);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody DoctorLoginRequest request) {
        AuthResponse response = doctorService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/records/{email}")
    public ResponseEntity<List<MedicalRecord>> getAccessibleRecords(@PathVariable String email) {
        List<MedicalRecord> records = doctorService.getAccessibleRecords(email);
        return ResponseEntity.ok(records);
    }

    @PostMapping("/request-access")
    public ResponseEntity<String> requestAccess(@Valid @RequestBody AccessRequestDto request) {
        String result = doctorService.requestAccess(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors() {
        List<DoctorResponseDto> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/access-requests/{patientEmail}")
    public ResponseEntity<List<AccessPermission>> getAccessRequests(@PathVariable String patientEmail) {
        List<AccessPermission> requests = doctorService.getAccessPermissionsForPatient(patientEmail);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/my-requests/{doctorEmail}")
    public ResponseEntity<List<AccessPermission>> getDoctorRequests(@PathVariable String doctorEmail) {
        List<AccessPermission> requests = doctorService.getAccessPermissionsForDoctor(doctorEmail);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<Doctor> getDoctorProfile(@PathVariable String email) {
        Doctor doctor = doctorService.getDoctorProfile(email);
        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/wallet")
    public ResponseEntity<String> updateWallet(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String walletAddress = payload.get("walletAddress");
        if (email == null || walletAddress == null) {
            return ResponseEntity.badRequest().body("Email and walletAddress are required");
        }
        doctorService.updateDoctorWallet(email, walletAddress);
        return ResponseEntity.ok("Wallet updated successfully");
    }

    @PostMapping("/grant-access")
    public ResponseEntity<AccessPermission> grantAccess(@RequestBody Map<String, String> payload) {
        String patientEmail = payload.get("patientEmail");
        String doctorEmail = payload.get("doctorEmail");
        String type = payload.getOrDefault("type", "Full Medical History");
        AccessPermission permission = doctorService.grantAccess(patientEmail, doctorEmail, type);
        return ResponseEntity.ok(permission);
    }

    @PostMapping("/revoke-access")
    public ResponseEntity<AccessPermission> revokeAccess(@RequestBody Map<String, String> payload) {
        String patientEmail = payload.get("patientEmail");
        String doctorEmail = payload.get("doctorEmail");
        AccessPermission permission = doctorService.revokeAccess(patientEmail, doctorEmail);
        return ResponseEntity.ok(permission);
    }

    @PostMapping("/respond-request")
    public ResponseEntity<AccessPermission> respondToRequest(@RequestBody Map<String, Object> payload) {
        Long requestId = Long.valueOf(payload.get("requestId").toString());
        String status = payload.get("status").toString();
        AccessPermission permission = doctorService.respondToAccessRequest(requestId, status);
        return ResponseEntity.ok(permission);
    }
}
