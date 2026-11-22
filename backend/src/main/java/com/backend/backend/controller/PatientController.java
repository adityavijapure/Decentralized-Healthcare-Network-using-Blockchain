package com.backend.backend.controller;

import com.backend.backend.dto.request.PatientLoginRequest;
import com.backend.backend.dto.request.PatientSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Patient;
import com.backend.backend.repository.PatientRepository;
import com.backend.backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/patient")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepository;

    @Autowired
    public PatientController(PatientService patientService, PatientRepository patientRepository) {
        this.patientService = patientService;
        this.patientRepository = patientRepository;
    }

    @PostMapping(value = "/signup", consumes = { "multipart/form-data", "application/x-www-form-urlencoded" })
    public ResponseEntity<Patient> registerMultipart(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("fullname") String fullname,
            @RequestParam(value = "walletAddress", required = false) String walletAddress,
            @RequestParam(value = "signature", required = false) String signature,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        PatientSignupRequest request = new PatientSignupRequest(fullname, email, password, walletAddress, signature);
        Patient saved = patientService.registerMultipart(request, profileImage);
        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<Patient> registerJson(@Valid @RequestBody PatientSignupRequest request) {
        Patient saved = patientService.registerJson(request);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody PatientLoginRequest request) {
        AuthResponse response = patientService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<Patient> getProfile(@PathVariable String email) {
        return patientRepository.findByEmail(email)
                .map(p -> {
                    p.setPassword(null); // Never expose password hash
                    return ResponseEntity.ok(p);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/wallet")
    public ResponseEntity<String> updateWallet(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String walletAddress = payload.get("walletAddress");
        if (email == null || walletAddress == null) {
            return ResponseEntity.badRequest().body("Email and walletAddress are required");
        }
        return patientRepository.findByEmail(email)
                .map(patient -> {
                    patient.setWalletAddress(walletAddress);
                    patientRepository.save(patient);
                    return ResponseEntity.ok("Wallet updated successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
