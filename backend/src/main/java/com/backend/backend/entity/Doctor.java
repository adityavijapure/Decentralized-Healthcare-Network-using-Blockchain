package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String licenseNumber;
    private String specialization;
    private String medicalCouncil;
    private String regYear;

    private String walletAddress;
    private String proofFilePath;

    // Blockchain Verification Hash (CID)
    private String validityHash;

    // Status: e.g., "AUTHORIZED_NODE", "PENDING_VERIFICATION", or "VERIFIED"
    private String status;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
