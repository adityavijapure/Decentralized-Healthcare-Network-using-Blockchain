package com.backend.backend.service.impl;

import com.backend.backend.constant.AppConstants;
import com.backend.backend.dto.request.PatientLoginRequest;
import com.backend.backend.dto.request.PatientSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Patient;
import com.backend.backend.exception.DuplicateResourceException;
import com.backend.backend.exception.InvalidCredentialsException;
import com.backend.backend.repository.PatientRepository;
import com.backend.backend.service.FileStorageService;
import com.backend.backend.service.PatientService;
import com.backend.backend.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PatientServiceImpl(PatientRepository patientRepository, 
                              FileStorageService fileStorageService, 
                              PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public Patient registerMultipart(PatientSignupRequest request, MultipartFile profileImage) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists!");
        }

        String profileImagePath = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImagePath = fileStorageService.storeFile(profileImage, AppConstants.UPLOAD_DIR_PATIENTS);
        }

        Patient patient = new Patient(
                request.getFullname(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getWalletAddress(),
                profileImagePath
        );

        return patientRepository.save(patient);
    }

    @Override
    @Transactional
    public Patient registerJson(PatientSignupRequest request) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists!");
        }

        Patient patient = new Patient(
                request.getFullname(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getWalletAddress(),
                null
        );

        return patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(PatientLoginRequest request) {
        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Email or Password"));

        boolean matches = passwordEncoder.matches(request.getPassword(), patient.getPassword());

        // Backward compatibility fallback for legacy SHA-256 Base64 passwords
        if (!matches) {
            String legacyHash = HashUtil.hashPassword(request.getPassword());
            if (legacyHash.equals(patient.getPassword())) {
                matches = true;
            }
        }

        if (!matches) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        return AuthResponse.builder()
                .email(patient.getEmail())
                .fullname(patient.getFullname())
                .role(AppConstants.ROLE_PATIENT)
                .profileImagePath(patient.getProfileImagePath())
                .walletAddress(patient.getWalletAddress())
                .build();
    }
}
