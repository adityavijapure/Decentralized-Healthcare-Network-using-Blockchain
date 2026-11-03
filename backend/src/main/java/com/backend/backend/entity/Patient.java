package com.backend.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String walletAddress;

    private String profileImagePath;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Patient() {
    }

    public Patient(String fullname, String email, String password, String walletAddress, String profileImagePath) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.walletAddress = walletAddress;
        this.profileImagePath = profileImagePath;
        this.createdAt = LocalDateTime.now();
    }

    public Patient(Long id, String fullname, String email, String password, String walletAddress, String profileImagePath, LocalDateTime createdAt) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.walletAddress = walletAddress;
        this.profileImagePath = profileImagePath;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
