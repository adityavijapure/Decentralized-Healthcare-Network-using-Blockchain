package com.backend.backend.service.impl;

import com.backend.backend.constant.AppConstants;
import com.backend.backend.dto.request.HospitalLoginRequest;
import com.backend.backend.dto.request.HospitalSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.Hospital;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.entity.Patient;
import com.backend.backend.exception.DuplicateResourceException;
import com.backend.backend.exception.FileStorageException;
import com.backend.backend.exception.InvalidCredentialsException;
import com.backend.backend.exception.ResourceNotFoundException;
import com.backend.backend.repository.DoctorRepository;
import com.backend.backend.repository.HospitalRepository;
import com.backend.backend.repository.PatientRepository;
import com.backend.backend.repository.RecordRepository;
import com.backend.backend.service.FileStorageService;
import com.backend.backend.service.HospitalService;
import com.backend.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final RecordRepository recordRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public HospitalServiceImpl(HospitalRepository hospitalRepository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository,
                               RecordRepository recordRepository,
                               FileStorageService fileStorageService,
                               PasswordEncoder passwordEncoder,
                               JwtUtil jwtUtil) {
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.recordRepository = recordRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

        // Store hospital account in database
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
                "HOSP_VERIFIED",
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

        // Generate secure JWT token
        String token = jwtUtil.generateToken(hospital.getEmail(), AppConstants.ROLE_HOSPITAL, hospital.getHospitalName());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(hospital.getEmail())
                .hospitalName(hospital.getHospitalName())
                .role(AppConstants.ROLE_HOSPITAL)
                .logo(hospital.getLogoPath())
                .walletAddress(hospital.getWalletAddress())
                .status(hospital.getStatus())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Hospital getHospitalProfile(String email) {
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital facility not found with email: " + email));
        hospital.setPassword(null);
        return hospital;
    }

    @Override
    @Transactional
    public void updateHospitalWallet(String email, String walletAddress) {
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital facility not found with email: " + email));
        hospital.setWalletAddress(walletAddress);
        hospitalRepository.save(hospital);
    }

    @Override
    @Transactional(readOnly = true)
    public Patient verifyPatient(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No patient found with email: " + email));
        patient.setPassword(null);
        return patient;
    }

    @Override
    @Transactional
    public Doctor verifyDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor practitioner not found with ID: " + doctorId));
        doctor.setStatus(AppConstants.STATUS_VERIFIED);
        doctor.setPassword(null);
        return doctorRepository.save(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecord> getAllUploadedReports() {
        return recordRepository.findAll();
    }
}
