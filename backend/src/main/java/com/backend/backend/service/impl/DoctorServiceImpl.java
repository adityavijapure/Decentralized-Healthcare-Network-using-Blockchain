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
import com.backend.backend.service.BlockchainService;
import com.backend.backend.service.DoctorService;
import com.backend.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final RecordRepository recordRepository;
    private final FileStorageService fileStorageService;
    private final BlockchainService blockchainService;
    private final PasswordEncoder passwordEncoder;

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

        String validityHash = blockchainService.generateNodeHash("DrVerify", request.getEmail());

        Doctor doctor = Doctor.builder()
                .fullname(request.getFullname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .licenseNumber(request.getLicenseNumber())
                .regYear(request.getRegYear())
                .medicalCouncil(request.getMedicalCouncil())
                .specialization(request.getSpecialization())
                .walletAddress(request.getWalletAddress())
                .proofFilePath(proofFilePath)
                .validityHash(validityHash)
                .status(AppConstants.STATUS_AUTHORIZED)
                .build();

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

        return AuthResponse.builder()
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
        return "Access Request broadcasted to Blockchain for Patient: " + request.getPatientEmail();
    }
}
