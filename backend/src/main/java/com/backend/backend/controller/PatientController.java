package com.backend.backend.controller;

import com.backend.backend.dto.request.PatientLoginRequest;
import com.backend.backend.dto.request.PatientSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Patient;
import com.backend.backend.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth/patient")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping(value = "/signup", consumes = { "multipart/form-data", "application/x-www-form-urlencoded" })
    public ResponseEntity<Patient> registerMultipart(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("fullname") String fullname,
            @RequestParam(value = "walletAddress", required = false) String walletAddress,
            @RequestParam(value = "signature", required = false) String signature,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        PatientSignupRequest request = PatientSignupRequest.builder()
                .email(email)
                .password(password)
                .fullname(fullname)
                .walletAddress(walletAddress)
                .signature(signature)
                .build();

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
}
