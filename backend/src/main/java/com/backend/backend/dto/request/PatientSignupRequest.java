package com.backend.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PatientSignupRequest {

    @NotBlank(message = "Full name is required")
    private String fullname;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String walletAddress;
    private String signature;

    public PatientSignupRequest() {
    }

    public PatientSignupRequest(String fullname, String email, String password, String walletAddress, String signature) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.walletAddress = walletAddress;
        this.signature = signature;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fullname;
        private String email;
        private String password;
        private String walletAddress;
        private String signature;

        public Builder fullname(String fullname) { this.fullname = fullname; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder walletAddress(String walletAddress) { this.walletAddress = walletAddress; return this; }
        public Builder signature(String signature) { this.signature = signature; return this; }

        public PatientSignupRequest build() {
            return new PatientSignupRequest(fullname, email, password, walletAddress, signature);
        }
    }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
}
