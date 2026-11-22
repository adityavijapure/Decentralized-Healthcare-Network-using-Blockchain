package com.backend.backend.service.impl;

import com.backend.backend.constant.AppConstants;
import com.backend.backend.dto.request.AccessRequestDto;
import com.backend.backend.dto.request.DoctorLoginRequest;
import com.backend.backend.dto.request.DoctorSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.dto.response.DoctorResponseDto;
import com.backend.backend.entity.AccessPermission;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.exception.DuplicateResourceException;
import com.backend.backend.exception.InvalidCredentialsException;
import com.backend.backend.exception.ResourceNotFoundException;
import com.backend.backend.repository.AccessPermissionRepository;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final RecordRepository recordRepository;
    private final AccessPermissionRepository accessPermissionRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository,
                             RecordRepository recordRepository,
                             AccessPermissionRepository accessPermissionRepository,
                             FileStorageService fileStorageService,
                             PasswordEncoder passwordEncoder,
                             JwtUtil jwtUtil) {
        this.doctorRepository = doctorRepository;
        this.recordRepository = recordRepository;
        this.accessPermissionRepository = accessPermissionRepository;
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
    @Transactional
    public String requestAccess(AccessRequestDto request) {
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(request.getDoctorEmail());
        String doctorName = doctorOpt.map(Doctor::getFullname).orElse("Dr. " + request.getDoctorEmail());
        String spec = doctorOpt.map(Doctor::getSpecialization).orElse("Specialist");

        Optional<AccessPermission> existing = accessPermissionRepository
                .findByPatientEmailAndDoctorEmail(request.getPatientEmail(), request.getDoctorEmail());

        AccessPermission perm;
        if (existing.isPresent()) {
            perm = existing.get();
            perm.setStatus("PENDING");
            perm.setRequestType(request.getType() != null ? request.getType() : "Full Medical History");
            perm.setDoctorName(doctorName);
            perm.setSpecialization(spec);
            perm.setUpdatedAt(LocalDateTime.now());
        } else {
            perm = new AccessPermission(
                    request.getPatientEmail(),
                    request.getDoctorEmail(),
                    doctorName,
                    spec,
                    request.getType(),
                    "PENDING"
            );
        }
        accessPermissionRepository.save(perm);
        return "Access Request sent for Patient: " + request.getPatientEmail();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(doc -> new DoctorResponseDto(
                        doc.getId(),
                        doc.getFullname(),
                        doc.getEmail(),
                        doc.getSpecialization(),
                        doc.getLicenseNumber(),
                        doc.getMedicalCouncil(),
                        doc.getRegYear(),
                        doc.getWalletAddress(),
                        doc.getStatus()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessPermission> getAccessPermissionsForPatient(String patientEmail) {
        return accessPermissionRepository.findByPatientEmail(patientEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessPermission> getAccessPermissionsForDoctor(String doctorEmail) {
        return accessPermissionRepository.findByDoctorEmail(doctorEmail);
    }

    @Override
    @Transactional
    public AccessPermission grantAccess(String patientEmail, String doctorEmail, String requestType) {
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(doctorEmail);
        String doctorName = doctorOpt.map(Doctor::getFullname).orElse("Dr. " + doctorEmail);
        String spec = doctorOpt.map(Doctor::getSpecialization).orElse("General Practitioner");

        Optional<AccessPermission> existing = accessPermissionRepository
                .findByPatientEmailAndDoctorEmail(patientEmail, doctorEmail);

        AccessPermission perm;
        if (existing.isPresent()) {
            perm = existing.get();
            perm.setStatus("APPROVED");
            if (requestType != null) perm.setRequestType(requestType);
            perm.setDoctorName(doctorName);
            perm.setSpecialization(spec);
            perm.setUpdatedAt(LocalDateTime.now());
        } else {
            perm = new AccessPermission(
                    patientEmail,
                    doctorEmail,
                    doctorName,
                    spec,
                    requestType != null ? requestType : "Full Medical History",
                    "APPROVED"
            );
        }
        return accessPermissionRepository.save(perm);
    }

    @Override
    @Transactional
    public AccessPermission revokeAccess(String patientEmail, String doctorEmail) {
        Optional<AccessPermission> existing = accessPermissionRepository
                .findByPatientEmailAndDoctorEmail(patientEmail, doctorEmail);

        if (existing.isPresent()) {
            AccessPermission perm = existing.get();
            perm.setStatus("REVOKED");
            perm.setUpdatedAt(LocalDateTime.now());
            return accessPermissionRepository.save(perm);
        } else {
            throw new ResourceNotFoundException("No active permission found for this doctor.");
        }
    }

    @Override
    @Transactional
    public AccessPermission respondToAccessRequest(Long permissionId, String status) {
        AccessPermission perm = accessPermissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Access request not found with ID: " + permissionId));
        perm.setStatus(status.toUpperCase());
        perm.setUpdatedAt(LocalDateTime.now());
        return accessPermissionRepository.save(perm);
    }

    @Override
    @Transactional(readOnly = true)
    public Doctor getDoctorProfile(String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + email));
        doctor.setPassword(null); // Never expose password hash
        return doctor;
    }

    @Override
    @Transactional
    public void updateDoctorWallet(String email, String walletAddress) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + email));
        doctor.setWalletAddress(walletAddress);
        doctorRepository.save(doctor);
    }
}
