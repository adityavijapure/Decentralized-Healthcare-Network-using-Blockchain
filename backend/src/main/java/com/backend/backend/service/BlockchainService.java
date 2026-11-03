package com.backend.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface BlockchainService {
    String generateRecordHash(String title, String email, MultipartFile file);
    String generateNodeHash(String prefix, String identifier);
    boolean verifyEthereumSignature(String message, String signature, String walletAddress);
}
