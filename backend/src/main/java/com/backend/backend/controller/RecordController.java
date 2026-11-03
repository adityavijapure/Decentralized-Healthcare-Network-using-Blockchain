package com.backend.backend.controller;

import com.backend.backend.entity.MedicalRecord;
import com.backend.backend.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @GetMapping("/{email}")
    public ResponseEntity<List<MedicalRecord>> getRecords(@PathVariable String email) {
        List<MedicalRecord> records = recordService.getRecordsByPatient(email);
        return ResponseEntity.ok(records);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadRecord(
            @RequestParam("title") String title,
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file) {

        String blockchainHash = recordService.uploadRecord(title, email, file);
        return ResponseEntity.ok("Record secured on Blockchain Hash: " + blockchainHash);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecord(@PathVariable Long id) {
        recordService.deleteRecord(id);
        return ResponseEntity.ok("Record removed from local database.");
    }
}
