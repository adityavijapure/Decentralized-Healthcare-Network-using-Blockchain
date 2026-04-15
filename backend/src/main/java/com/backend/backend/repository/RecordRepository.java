package com.backend.backend.repository;

import com.backend.backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<MedicalRecord, Long> {
    // Custom query to find only records belonging to a specific patient
    List<MedicalRecord> findByPatientEmail(String patientEmail);
}