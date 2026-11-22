package com.backend.backend.repository;

import com.backend.backend.entity.AccessPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccessPermissionRepository extends JpaRepository<AccessPermission, Long> {
    List<AccessPermission> findByPatientEmail(String patientEmail);
    List<AccessPermission> findByDoctorEmail(String doctorEmail);
    Optional<AccessPermission> findByPatientEmailAndDoctorEmail(String patientEmail, String doctorEmail);
}
