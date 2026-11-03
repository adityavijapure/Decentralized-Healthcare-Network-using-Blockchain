package com.backend.backend.service;

import com.backend.backend.entity.MedicalRecord;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RecordService {
    List<MedicalRecord> getRecordsByPatient(String email);
    String uploadRecord(String title, String email, MultipartFile file);
    void deleteRecord(Long id);
}

