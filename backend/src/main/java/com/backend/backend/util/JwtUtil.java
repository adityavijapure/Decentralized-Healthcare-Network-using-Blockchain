package com.backend.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private final long expirationMillis;

    public JwtUtil(
            @Value("${jwt.secret:4c65616441726368697465637441646974796156696a61707572654865616c7468436861696e323032365365637572654b6579}") String secret,
            @Value("${jwt.expiration:86400000}") long expirationMillis) {
        
        // Ensure secret is at least 256 bits (32 bytes)
        byte[] keyBytes;
        if (secret.length() < 32) {
            String padded = String.format("%-32s", secret).replace(' ', 'X');
            keyBytes = padded.getBytes(StandardCharsets.UTF_8);
        } else {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(String email, String role, String fullname) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("fullname", fullname);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date expiryDate = new Date(nowMillis + expirationMillis);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null ? (String) claims.get("role") : null;
    }

    public String extractFullname(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null ? (String) claims.get("fullname") : null;
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claims != null ? claimsResolver.apply(claims) : null;
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception ex) {
            return null;
        }
    }

    public boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration != null && expiration.before(new Date());
    }

    public boolean validateToken(String token, String email) {
        String extractedEmail = extractEmail(token);
        return extractedEmail != null && extractedEmail.equalsIgnoreCase(email) && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token) {
        return extractEmail(token) != null && !isTokenExpired(token);
    }
}

