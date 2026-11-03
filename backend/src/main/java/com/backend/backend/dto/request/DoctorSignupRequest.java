package com.backend.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DoctorSignupRequest {

    @NotBlank(message = "Full name is required")
    private String fullname;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private String regYear;
    private String medicalCouncil;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String walletAddress;

    public DoctorSignupRequest() {
    }

    public DoctorSignupRequest(String fullname, String email, String password, String licenseNumber, 
                               String regYear, String medicalCouncil, String specialization, String walletAddress) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.licenseNumber = licenseNumber;
        this.regYear = regYear;
        this.medicalCouncil = medicalCouncil;
        this.specialization = specialization;
        this.walletAddress = walletAddress;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fullname;
        private String email;
        private String password;
        private String licenseNumber;
        private String regYear;
        private String medicalCouncil;
        private String specialization;
        private String walletAddress;

        public Builder fullname(String fullname) { this.fullname = fullname; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public Builder regYear(String regYear) { this.regYear = regYear; return this; }
        public Builder medicalCouncil(String medicalCouncil) { this.medicalCouncil = medicalCouncil; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder walletAddress(String walletAddress) { this.walletAddress = walletAddress; return this; }

        public DoctorSignupRequest build() {
            return new DoctorSignupRequest(fullname, email, password, licenseNumber, regYear, medicalCouncil, specialization, walletAddress);
        }
    }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getRegYear() { return regYear; }
    public void setRegYear(String regYear) { this.regYear = regYear; }

    public String getMedicalCouncil() { return medicalCouncil; }
    public void setMedicalCouncil(String medicalCouncil) { this.medicalCouncil = medicalCouncil; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
}
