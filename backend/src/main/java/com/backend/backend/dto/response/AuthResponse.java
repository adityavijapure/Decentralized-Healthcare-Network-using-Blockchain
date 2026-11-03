package com.backend.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String email;
    private String fullname;
    private String hospitalName;
    private String role;
    private String specialization;
    private String status;
    private String profileImagePath;
    private String logo;
    private String walletAddress;
}
