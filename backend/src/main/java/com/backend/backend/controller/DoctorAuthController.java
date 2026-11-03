package com.backend.backend.controller;

import com.backend.backend.dto.request.AccessRequestDto;
import com.backend.backend.dto.request.DoctorLoginRequest;
import com.backend.backend.dto.request.DoctorSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DoctorAuthController {

    private final DoctorService doctorService;

    @PostMapping("/signup")
    public ResponseEntity<Doctor> register(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("fullname") String fullname,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam("regYear") String regYear,
            @RequestParam("medicalCouncil") String medicalCouncil,
            @RequestParam("specialization") String specialization,
            @RequestParam("walletAddress") String walletAddress,
            @RequestParam(value = "proofFile", required = false) MultipartFile proofFile) {

        DoctorSignupRequest request = DoctorSignupRequest.builder()
                .email(email)
                .password(password)
                .fullname(fullname)
                .licenseNumber(licenseNumber)
                .regYear(regYear)
                .medicalCouncil(medicalCouncil)
                .specialization(specialization)
                .walletAddress(walletAddress)
                .build();

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
}
