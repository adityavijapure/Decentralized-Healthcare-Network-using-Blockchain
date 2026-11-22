package com.backend.backend.dto.response;

public class DoctorResponseDto {
    private Long id;
    private String fullname;
    private String email;
    private String specialization;
    private String licenseNumber;
    private String medicalCouncil;
    private String regYear;
    private String walletAddress;
    private String status;

    public DoctorResponseDto() {
    }

    public DoctorResponseDto(Long id, String fullname, String email, String specialization,
                             String licenseNumber, String medicalCouncil, String regYear,
                             String walletAddress, String status) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
        this.medicalCouncil = medicalCouncil;
        this.regYear = regYear;
        this.walletAddress = walletAddress;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getMedicalCouncil() { return medicalCouncil; }
    public void setMedicalCouncil(String medicalCouncil) { this.medicalCouncil = medicalCouncil; }

    public String getRegYear() { return regYear; }
    public void setRegYear(String regYear) { this.regYear = regYear; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
