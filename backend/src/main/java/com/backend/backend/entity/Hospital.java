package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String hospitalName;
    private String estYear;
    private String licenseNumber;
    private String councilReg;

    private String regCertPath;
    private String logoPath;

    private String walletAddress;
    private String blockchainHash;
    private String status;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
