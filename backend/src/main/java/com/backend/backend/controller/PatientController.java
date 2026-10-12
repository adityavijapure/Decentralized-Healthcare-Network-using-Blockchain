package com.backend.backend.controller;

import com.backend.backend.model.PatientRequest;
import com.backend.backend.repository.PatientRepository; // You'll need to create this Interface
import com.backend.backend.util.HashUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth/patient")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping(value = "/signup", consumes = { "multipart/form-data", "application/x-www-form-urlencoded" })
    public ResponseEntity<?> registerMultipart(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("fullname") String fullname,
            @RequestParam(value = "walletAddress", required = false) String walletAddress,
            @RequestParam(value = "signature", required = false) String signature,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        if (patientRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        PatientRequest patient = new PatientRequest();
        patient.setEmail(email);
        patient.setFullname(fullname);
        patient.setWalletAddress(walletAddress);
        patient.setPassword(HashUtil.hashPassword(password));
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<?> registerJson(@RequestBody PatientRequest patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        patient.setPassword(HashUtil.hashPassword(patient.getPassword()));
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password required");
        }
        String hashedInput = HashUtil.hashPassword(password);

        return patientRepository.findByEmail(email)
            .filter(p -> p.getPassword().equals(hashedInput))
            .map(p -> {
                Map<String, Object> resp = new HashMap<>();
                resp.put("email", p.getEmail());
                resp.put("fullname", p.getFullname());
                resp.put("role", "Patient");
                return ResponseEntity.ok((Object) resp);
            })
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password"));
    }
}