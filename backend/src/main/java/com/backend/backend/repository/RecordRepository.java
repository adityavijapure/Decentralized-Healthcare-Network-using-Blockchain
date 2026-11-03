package com.backend.backend.repository;

import com.backend.backend.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientEmail(String patientEmail);
}
