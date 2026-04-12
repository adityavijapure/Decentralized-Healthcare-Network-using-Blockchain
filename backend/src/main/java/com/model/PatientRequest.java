package com.model;
import lombok.Data;

@Data
public class PatientRequest {
    private String fullname;
    private String email;
    private String password; // This is your "Secure Key"
}