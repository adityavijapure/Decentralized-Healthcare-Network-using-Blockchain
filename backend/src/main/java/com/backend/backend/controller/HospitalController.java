package com.backend.backend.controller;

import com.backend.backend.model.Hospital;
import com.backend.backend.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/hospital")
@CrossOrigin(origins = "http://localhost:5173")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Define the directory where certificates and logos will be saved
    private final String UPLOAD_DIR = "uploads/hospitals/";

    @PostMapping("/signup")
    public ResponseEntity<?> registerHospital(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("hospitalName") String hospitalName,
            @RequestParam("estYear") String estYear,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam("councilReg") String councilReg,
            @RequestParam("walletAddress") String walletAddress,
            @RequestParam("regCert") MultipartFile regCert,
            @RequestParam(value = "hospitalLogo", required = false) MultipartFile hospitalLogo) {

        try {
            if (hospitalRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Institution email already registered!");
            }

            // 1. Create directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Save Registration Certificate
            String regCertName = UUID.randomUUID() + "_" + regCert.getOriginalFilename();
            Files.copy(regCert.getInputStream(), uploadPath.resolve(regCertName));

            // 3. Save Logo if provided
            String logoName = "default_logo.png";
            if (hospitalLogo != null && !hospitalLogo.isEmpty()) {
                logoName = UUID.randomUUID() + "_" + hospitalLogo.getOriginalFilename();
                Files.copy(hospitalLogo.getInputStream(), uploadPath.resolve(logoName));
            }

            // 4. Create Hospital Object
            Hospital hospital = new Hospital();
            hospital.setEmail(email);
            hospital.setHospitalName(hospitalName);
            hospital.setPassword(passwordEncoder.encode(password));
            hospital.setLicenseNumber(licenseNumber);
            hospital.setEstYear(estYear);
            hospital.setCouncilReg(councilReg);
            hospital.setWalletAddress(walletAddress);
            
            // Store file paths/names in DB
            hospital.setRegCertPath(regCertName);
            hospital.setLogoPath(logoName);
            
            // Blockchain Mock Hash
            hospital.setBlockchainHash("HOSP-NODE-" + UUID.randomUUID().toString().substring(0, 15).toUpperCase());
            hospital.setStatus("VERIFIED_INSTITUTION");

            return ResponseEntity.ok(hospitalRepository.save(hospital));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not save files: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Hospital> hospitalOpt = hospitalRepository.findByEmail(email);

        if (hospitalOpt.isPresent() && passwordEncoder.matches(password, hospitalOpt.get().getPassword())) {
            Hospital hospital = hospitalOpt.get();
            
            Map<String, String> response = new HashMap<>();
            response.put("email", hospital.getEmail());
            response.put("hospitalName", hospital.getHospitalName());
            response.put("role", "Hospital");
            response.put("logo", hospital.getLogoPath());
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Admin Credentials");
    }
}