package com.backend.backend.repository;

import com.backend.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // This tells Spring to create a query: SELECT * FROM doctor WHERE email = ?
    Optional<Doctor> findByEmail(String email);
}