package com.backend.backend.service.impl;

import com.backend.backend.constant.AppConstants;
import com.backend.backend.dto.request.HospitalLoginRequest;
import com.backend.backend.dto.request.HospitalSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Hospital;
import com.backend.backend.exception.DuplicateResourceException;
import com.backend.backend.exception.FileStorageException;
import com.backend.backend.exception.InvalidCredentialsException;
import com.backend.backend.repository.HospitalRepository;
import com.backend.backend.service.BlockchainService;
import com.backend.backend.service.FileStorageService;
import com.backend.backend.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final FileStorageService fileStorageService;
    private final BlockchainService blockchainService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public HospitalServiceImpl(HospitalRepository hospitalRepository,
                               FileStorageService fileStorageService,
                               BlockchainService blockchainService,
                               PasswordEncoder passwordEncoder) {
        this.hospitalRepository = hospitalRepository;
        this.fileStorageService = fileStorageService;
        this.blockchainService = blockchainService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public Hospital register(HospitalSignupRequest request, MultipartFile regCert, MultipartFile hospitalLogo) {
        if (hospitalRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Institution email already registered!");
        }

        if (regCert == null || regCert.isEmpty()) {
            throw new FileStorageException("Government Registration Certificate is mandatory!");
        }

        String regCertName = fileStorageService.storeFile(regCert, AppConstants.UPLOAD_DIR_HOSPITALS);
        
        String logoName = "default_logo.png";
        if (hospitalLogo != null && !hospitalLogo.isEmpty()) {
            logoName = fileStorageService.storeFile(hospitalLogo, AppConstants.UPLOAD_DIR_HOSPITALS);
        }

        String blockchainHash = blockchainService.generateNodeHash("HOSP-NODE", request.getEmail());

        Hospital hospital = new Hospital(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getHospitalName(),
                request.getEstYear(),
                request.getLicenseNumber(),
                request.getCouncilReg(),
                regCertName,
                logoName,
                request.getWalletAddress(),
                blockchainHash,
                AppConstants.STATUS_VERIFIED
        );

        return hospitalRepository.save(hospital);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(HospitalLoginRequest request) {
        Hospital hospital = hospitalRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Admin Credentials"));

        if (!passwordEncoder.matches(request.getPassword(), hospital.getPassword())) {
            throw new InvalidCredentialsException("Invalid Admin Credentials");
        }

        return AuthResponse.builder()
                .email(hospital.getEmail())
                .hospitalName(hospital.getHospitalName())
                .role(AppConstants.ROLE_HOSPITAL)
                .logo(hospital.getLogoPath())
                .walletAddress(hospital.getWalletAddress())
                .status(hospital.getStatus())
                .build();
    }
}
