package com.backend.backend.service;

import com.backend.backend.dto.request.AccessRequestDto;
import com.backend.backend.dto.request.DoctorLoginRequest;
import com.backend.backend.dto.request.DoctorSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.MedicalRecord;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DoctorService {
    Doctor register(DoctorSignupRequest request, MultipartFile proofFile);
    AuthResponse login(DoctorLoginRequest request);
    List<MedicalRecord> getAccessibleRecords(String email);
    String requestAccess(AccessRequestDto request);
}
