package com.backend.backend.service.impl;

import com.backend.backend.constant.AppConstants;
import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.exception.BadRequestException;
import com.backend.backend.repository.RecordRepository;
import com.backend.backend.service.BlockchainService;
import com.backend.backend.service.FileStorageService;
import com.backend.backend.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;
    private final BlockchainService blockchainService;
    private final FileStorageService fileStorageService;

    @Autowired
    public RecordServiceImpl(RecordRepository recordRepository,
                             BlockchainService blockchainService,
                             FileStorageService fileStorageService) {
        this.recordRepository = recordRepository;
        this.blockchainService = blockchainService;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecord> getRecordsByPatient(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Patient email is required");
        }
        return recordRepository.findByPatientEmail(email);
    }

    @Override
    @Transactional
    public String uploadRecord(String title, String email, MultipartFile file) {
        if (title == null || title.isBlank() || email == null || email.isBlank()) {
            throw new BadRequestException("Title and email are required");
        }

        if (file != null && !file.isEmpty()) {
            fileStorageService.storeFile(file, AppConstants.UPLOAD_DIR_RECORDS);
        }

        String blockchainHash = blockchainService.generateRecordHash(title, email, file);

        MedicalRecord record = new MedicalRecord(title, blockchainHash, email);
        recordRepository.save(record);

        return blockchainHash;
    }

    @Override
    @Transactional
    public void deleteRecord(Long id) {
        recordRepository.deleteById(id);
    }
}
