package com.backend.backend.service.impl;

import com.backend.backend.constant.AppConstants;
import com.backend.backend.dto.request.AccessRequestDto;
import com.backend.backend.dto.request.DoctorLoginRequest;
import com.backend.backend.dto.request.DoctorSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.exception.DuplicateResourceException;
import com.backend.backend.exception.InvalidCredentialsException;
import com.backend.backend.repository.DoctorRepository;
import com.backend.backend.repository.RecordRepository;
import com.backend.backend.service.DoctorService;
import com.backend.backend.service.FileStorageService;
import com.backend.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final RecordRepository recordRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository,
                             RecordRepository recordRepository,
                             FileStorageService fileStorageService,
                             PasswordEncoder passwordEncoder,
                             JwtUtil jwtUtil) {
        this.doctorRepository = doctorRepository;
        this.recordRepository = recordRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public Doctor register(DoctorSignupRequest request, MultipartFile proofFile) {
        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered!");
        }

        String proofFilePath = null;
        if (proofFile != null && !proofFile.isEmpty()) {
            proofFilePath = fileStorageService.storeFile(proofFile, AppConstants.UPLOAD_DIR_DOCTORS);
        }

        // Store doctor record in database with verified status
        Doctor doctor = new Doctor(
                request.getFullname(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getLicenseNumber(),
                request.getSpecialization(),
                request.getMedicalCouncil(),
                request.getRegYear(),
                request.getWalletAddress(),
                proofFilePath,
                "DB_VERIFIED",
                AppConstants.STATUS_AUTHORIZED
        );

        return doctorRepository.save(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(DoctorLoginRequest request) {
        Doctor doctor = doctorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Credentials"));

        if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
            throw new InvalidCredentialsException("Invalid Credentials");
        }

        // Generate secure JWT token
        String token = jwtUtil.generateToken(doctor.getEmail(), AppConstants.ROLE_DOCTOR, doctor.getFullname());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(doctor.getEmail())
                .fullname(doctor.getFullname())
                .role(AppConstants.ROLE_DOCTOR)
                .specialization(doctor.getSpecialization())
                .status(doctor.getStatus())
                .walletAddress(doctor.getWalletAddress())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecord> getAccessibleRecords(String email) {
        return recordRepository.findAll();
    }

    @Override
    public String requestAccess(AccessRequestDto request) {
        return "Access Request sent for Patient: " + request.getPatientEmail();
    }
}
