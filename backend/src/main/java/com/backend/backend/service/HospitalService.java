package com.backend.backend.service;

import com.backend.backend.dto.request.HospitalLoginRequest;
import com.backend.backend.dto.request.HospitalSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Hospital;
import org.springframework.web.multipart.MultipartFile;

public interface HospitalService {
    Hospital register(HospitalSignupRequest request, MultipartFile regCert, MultipartFile hospitalLogo);
    AuthResponse login(HospitalLoginRequest request);
}

