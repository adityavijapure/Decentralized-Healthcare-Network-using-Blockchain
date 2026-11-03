package com.backend.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class HospitalSignupRequest {

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String estYear;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private String councilReg;
    private String walletAddress;

    public HospitalSignupRequest() {
    }

    public HospitalSignupRequest(String hospitalName, String email, String password, String estYear, 
                                 String licenseNumber, String councilReg, String walletAddress) {
        this.hospitalName = hospitalName;
        this.email = email;
        this.password = password;
        this.estYear = estYear;
        this.licenseNumber = licenseNumber;
        this.councilReg = councilReg;
        this.walletAddress = walletAddress;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String hospitalName;
        private String email;
        private String password;
        private String estYear;
        private String licenseNumber;
        private String councilReg;
        private String walletAddress;

        public Builder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder estYear(String estYear) { this.estYear = estYear; return this; }
        public Builder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public Builder councilReg(String councilReg) { this.councilReg = councilReg; return this; }
        public Builder walletAddress(String walletAddress) { this.walletAddress = walletAddress; return this; }

        public HospitalSignupRequest build() {
            return new HospitalSignupRequest(hospitalName, email, password, estYear, licenseNumber, councilReg, walletAddress);
        }
    }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEstYear() { return estYear; }
    public void setEstYear(String estYear) { this.estYear = estYear; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getCouncilReg() { return councilReg; }
    public void setCouncilReg(String councilReg) { this.councilReg = councilReg; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
}
