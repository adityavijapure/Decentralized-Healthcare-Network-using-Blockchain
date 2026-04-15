package com.backend.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
@Data // Generates getters, setters, and toString automatically via Lombok
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    // This stores the IPFS/Blockchain reference hash
    private String fileHash;

    private String date;

    // This links the record to the patient who uploaded it
    private String patientEmail;

    // Default constructor for Hibernate
    public MedicalRecord() {}

    public MedicalRecord(String title, String fileHash, String patientEmail) {
        this.title = title;
        this.fileHash = fileHash;
        this.patientEmail = patientEmail;
        this.date = LocalDate.now().toString(); // Automatically sets current date
    }
}