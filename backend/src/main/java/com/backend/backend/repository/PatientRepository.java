package com.backend.backend.repository;

import com.backend.backend.model.PatientRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<PatientRequest, Long> {
    // This allows the .findByEmail() call in your controller to work
    Optional<PatientRequest> findByEmail(String email);
}