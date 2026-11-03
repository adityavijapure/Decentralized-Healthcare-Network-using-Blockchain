package com.backend.backend.service;

import com.backend.backend.dto.request.PatientLoginRequest;
import com.backend.backend.dto.request.PatientSignupRequest;
import com.backend.backend.dto.response.AuthResponse;
import com.backend.backend.entity.Patient;
import org.springframework.web.multipart.MultipartFile;

public interface PatientService {
    Patient registerMultipart(PatientSignupRequest request, MultipartFile profileImage);
    Patient registerJson(PatientSignupRequest request);
    AuthResponse login(PatientLoginRequest request);
}
