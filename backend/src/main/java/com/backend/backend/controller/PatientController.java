package com.backend.backend.controller;

import com.backend.backend.model.PatientRequest;
import com.backend.backend.repository.PatientRepository; // You'll need to create this Interface
import com.backend.backend.util.HashUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/patient")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody PatientRequest patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        patient.setPassword(HashUtil.hashPassword(patient.getPassword()));
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String hashedInput = HashUtil.hashPassword(credentials.get("password"));

        return patientRepository.findByEmail(email)
            .filter(p -> p.getPassword().equals(hashedInput))
            .map(p -> ResponseEntity.ok("Login Success"))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password"));
    }
}