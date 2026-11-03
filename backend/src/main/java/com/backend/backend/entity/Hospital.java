package com.backend.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
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

    private LocalDateTime createdAt = LocalDateTime.now();

    public Hospital() {
    }

    public Hospital(String email, String password, String hospitalName, String estYear, 
                    String licenseNumber, String councilReg, String regCertPath, 
                    String logoPath, String walletAddress, String blockchainHash, String status) {
        this.email = email;
        this.password = password;
        this.hospitalName = hospitalName;
        this.estYear = estYear;
        this.licenseNumber = licenseNumber;
        this.councilReg = councilReg;
        this.regCertPath = regCertPath;
        this.logoPath = logoPath;
        this.walletAddress = walletAddress;
        this.blockchainHash = blockchainHash;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
