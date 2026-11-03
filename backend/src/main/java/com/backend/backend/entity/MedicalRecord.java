package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String fileHash;

    private String date;

    @Column(nullable = false)
    private String patientEmail;

    public MedicalRecord(String title, String fileHash, String patientEmail) {
        this.title = title;
        this.fileHash = fileHash;
        this.patientEmail = patientEmail;
        this.date = LocalDate.now().toString();
    }
}
