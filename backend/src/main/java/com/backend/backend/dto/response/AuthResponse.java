package com.backend.backend.dto.response;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String email;
    private String fullname;
    private String hospitalName;
    private String role;
    private String specialization;
    private String status;
    private String profileImagePath;
    private String logo;
    private String walletAddress;

    public AuthResponse() {
    }

    public AuthResponse(String token, String tokenType, String email, String fullname, 
                        String hospitalName, String role, String specialization, 
                        String status, String profileImagePath, String logo, String walletAddress) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.email = email;
        this.fullname = fullname;
        this.hospitalName = hospitalName;
        this.role = role;
        this.specialization = specialization;
        this.status = status;
        this.profileImagePath = profileImagePath;
        this.logo = logo;
        this.walletAddress = walletAddress;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private String email;
        private String fullname;
        private String hospitalName;
        private String role;
        private String specialization;
        private String status;
        private String profileImagePath;
        private String logo;
        private String walletAddress;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullname(String fullname) { this.fullname = fullname; return this; }
        public Builder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder profileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; return this; }
        public Builder logo(String logo) { this.logo = logo; return this; }
        public Builder walletAddress(String walletAddress) { this.walletAddress = walletAddress; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, email, fullname, hospitalName, role, specialization, status, profileImagePath, logo, walletAddress);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProfileImagePath() { return profileImagePath; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
}
