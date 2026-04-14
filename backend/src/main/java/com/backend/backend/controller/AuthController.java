package com.backend.backend.controller;

import com.backend.backend.model.Doctor;
import com.backend.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }
        // Encrypt the password before saving
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return doctorRepository.findByEmail(email)
            .filter(doctor -> passwordEncoder.matches(password, doctor.getPassword()))
            .map(doctor -> ResponseEntity.ok("Authentication Successful"))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials"));
    }
}