package com.backend.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hospitals")
@Data
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Basic Auth Fields ---
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;

    // --- Institutional Details ---
    private String hospitalName;
    private String estYear;
    private String licenseNumber;
    private String councilReg;

    // --- File Storage Paths ---
    private String regCertPath; // Stores filename of the Gov Certificate
    private String logoPath;    // Stores filename of the Hospital Logo

    // --- Blockchain & Status Fields ---
    private String walletAddress;
    private String blockchainHash;
    private String status; // e.g., "VERIFIED_INSTITUTION"

    // Default Constructor
    public Hospital() {}

    // --- Manual Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getEstYear() { return estYear; }
    public void setEstYear(String estYear) { this.estYear = estYear; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getCouncilReg() { return councilReg; }
    public void setCouncilReg(String councilReg) { this.councilReg = councilReg; }

    public String getRegCertPath() { return regCertPath; }
    public void setRegCertPath(String regCertPath) { this.regCertPath = regCertPath; }

    public String getLogoPath() { return logoPath; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }

    public String getBlockchainHash() { return blockchainHash; }
    public void setBlockchainHash(String blockchainHash) { this.blockchainHash = blockchainHash; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}