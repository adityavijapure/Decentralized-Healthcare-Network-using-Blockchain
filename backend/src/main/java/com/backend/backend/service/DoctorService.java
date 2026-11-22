package com.backend.backend.service;

import com.backend.backend.dto.request.AccessRequestDto;
import com.backend.backend.dto.request.DoctorLoginRequest;
import com.backend.backend.dto.request.DoctorSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.dto.response.DoctorResponseDto;
import com.backend.backend.entity.AccessPermission;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.MedicalRecord;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DoctorService {
    Doctor register(DoctorSignupRequest request, MultipartFile proofFile);
    AuthResponse login(DoctorLoginRequest request);
    List<MedicalRecord> getAccessibleRecords(String email);
    String requestAccess(AccessRequestDto request);
    List<DoctorResponseDto> getAllDoctors();
    List<AccessPermission> getAccessPermissionsForPatient(String patientEmail);
    List<AccessPermission> getAccessPermissionsForDoctor(String doctorEmail);
    AccessPermission grantAccess(String patientEmail, String doctorEmail, String requestType);
    AccessPermission revokeAccess(String patientEmail, String doctorEmail);
    AccessPermission respondToAccessRequest(Long permissionId, String status);
    Doctor getDoctorProfile(String email);
    void updateDoctorWallet(String email, String walletAddress);
}
