package com.backend.backend.constant;

public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    public static final String ROLE_PATIENT = "Patient";
    public static final String ROLE_DOCTOR = "Doctor";
    public static final String ROLE_HOSPITAL = "Hospital";

    public static final String STATUS_AUTHORIZED = "AUTHORIZED_NODE";
    public static final String STATUS_VERIFIED = "VERIFIED_INSTITUTION";
    public static final String STATUS_PENDING = "PENDING_VERIFICATION";

    public static final String UPLOAD_DIR_ROOT = "uploads";
    public static final String UPLOAD_DIR_DOCTORS = "uploads/doctor_proofs";
    public static final String UPLOAD_DIR_HOSPITALS = "uploads/hospitals";
    public static final String UPLOAD_DIR_PATIENTS = "uploads/patients";
    public static final String UPLOAD_DIR_RECORDS = "uploads/medical_records";
}

