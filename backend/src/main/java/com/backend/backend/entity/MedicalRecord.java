package com.backend.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
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

    private String category = "General Report";

    private String fileName;

    public MedicalRecord() {
    }

    public MedicalRecord(String title, String fileHash, String patientEmail) {
        this.title = title;
        this.fileHash = fileHash;
        this.patientEmail = patientEmail;
        this.date = LocalDate.now().toString();
        this.category = "General Report";
    }

    public MedicalRecord(String title, String fileHash, String patientEmail, String category, String fileName) {
        this.title = title;
        this.fileHash = fileHash;
        this.patientEmail = patientEmail;
        this.category = category != null && !category.isBlank() ? category : "General Report";
        this.fileName = fileName;
        this.date = LocalDate.now().toString();
    }

    public MedicalRecord(Long id, String title, String fileHash, String date, String patientEmail) {
        this.id = id;
        this.title = title;
        this.fileHash = fileHash;
        this.date = date != null ? date : LocalDate.now().toString();
        this.patientEmail = patientEmail;
        this.category = "General Report";
    }

    public MedicalRecord(Long id, String title, String fileHash, String date, String patientEmail, String category, String fileName) {
        this.id = id;
        this.title = title;
        this.fileHash = fileHash;
        this.date = date != null ? date : LocalDate.now().toString();
        this.patientEmail = patientEmail;
        this.category = category != null && !category.isBlank() ? category : "General Report";
        this.fileName = fileName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
}
