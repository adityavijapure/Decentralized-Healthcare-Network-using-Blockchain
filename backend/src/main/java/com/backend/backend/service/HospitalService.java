package com.backend.backend.service;

import com.backend.backend.dto.request.HospitalLoginRequest;
import com.backend.backend.dto.request.HospitalSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Doctor;
import com.backend.backend.entity.Hospital;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.entity.Patient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HospitalService {
    Hospital register(HospitalSignupRequest request, MultipartFile regCert, MultipartFile hospitalLogo);
    AuthResponse login(HospitalLoginRequest request);
    Hospital getHospitalProfile(String email);
    void updateHospitalWallet(String email, String walletAddress);
    Patient verifyPatient(String email);
    Doctor verifyDoctor(Long doctorId);
    List<MedicalRecord> getAllUploadedReports();
}
