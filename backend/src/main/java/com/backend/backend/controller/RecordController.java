package com.backend.backend.controller;

import com.backend.backend.model.MedicalRecord;
import com.backend.backend.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/records")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to connect
public class RecordController {

    @Autowired
    private RecordRepository recordRepository;

    // 1. GET ALL RECORDS FOR A PATIENT
    @GetMapping("/{email}")
    public List<MedicalRecord> getRecords(@PathVariable String email) {
        return recordRepository.findByPatientEmail(email);
    }

    // 2. UPLOAD RECORD (Database + Simulated Blockchain Hash)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadRecord(
            @RequestParam("title") String title,
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file) {
        
        try {
            // SIMULATION: In a full production app, you would upload 'file' to IPFS here
            // and get a real hash back. For now, we generate a unique Blockchain Hash.
            String simulatedBlockchainHash = "Qm" + UUID.randomUUID().toString().replace("-", "").substring(0, 30);

            MedicalRecord record = new MedicalRecord(title, simulatedBlockchainHash, email);
            recordRepository.save(record);

            return ResponseEntity.ok("Record secured on Blockchain Hash: " + simulatedBlockchainHash);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    // 3. DELETE RECORD
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        recordRepository.deleteById(id);
        return ResponseEntity.ok("Record removed from local database.");
    }
}