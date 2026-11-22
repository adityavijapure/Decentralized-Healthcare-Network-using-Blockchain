// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HealthChain
 * @dev Decentralized Healthcare Network Smart Contract for Medical Records & Access Control
 * @notice Anchors cryptographic medical record hashes and manages patient-doctor consent on-chain.
 */
contract HealthChain {

    address public owner;

    // --- STRUCTS ---
    struct MedicalRecord {
        uint256 id;
        string title;
        string fileHash; // IPFS CID or SHA-256 digest
        string category; // Lab Report, MRI, Prescription, etc.
        uint256 timestamp;
        address patient;
        bytes32 patientEmailHash;
    }

    struct Doctor {
        address doctorAddress;
        string fullname;
        string licenseNumber;
        string specialization;
        bool isVerified;
        uint256 registeredAt;
    }

    struct AccessGrant {
        bool isGranted;
        string accessScope; // "Full Medical History", "Lab Reports Only", etc.
        uint256 grantedAt;
        uint256 expiresAt; // 0 for permanent until revoked
    }

    // --- STATE VARIABLES ---
    uint256 private _recordIdCounter;

    // Mapping from record ID to MedicalRecord
    mapping(uint256 => MedicalRecord) public records;

    // Mapping from fileHash (CID) to record ID
    mapping(string => uint256) public hashToRecordId;

    // Mapping from patient address to array of their record IDs
    mapping(address => uint256[]) private _patientRecordIds;

    // Mapping from doctor address to Doctor profile
    mapping(address => Doctor) public doctors;

    // Mapping: patient => doctor => AccessGrant
    mapping(address => mapping(address => AccessGrant)) public permissions;

    // Mapping of authorized hospitals/admins who can verify doctors
    mapping(address => bool) public authorizedVerifiers;

    // --- EVENTS ---
    event RecordAnchored(
        uint256 indexed recordId,
        address indexed patient,
        string fileHash,
        string title,
        string category,
        uint256 timestamp
    );

    event AccessGranted(
        address indexed patient,
        address indexed doctor,
        string accessScope,
        uint256 expiresAt
    );

    event AccessRevoked(
        address indexed patient,
        address indexed doctor,
        uint256 timestamp
    );

    event DoctorRegistered(
        address indexed doctor,
        string fullname,
        string licenseNumber,
        string specialization
    );

    event DoctorVerified(
        address indexed doctor,
        address indexed verifier,
        uint256 timestamp
    );

    // --- MODIFIERS ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute this");
        _;
    }

    modifier onlyVerifier() {
        require(msg.sender == owner || authorizedVerifiers[msg.sender], "Not authorized to verify practitioners");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedVerifiers[msg.sender] = true;
    }

    // =========================================================================
    // 1. MEDICAL RECORD ANCHORING
    // =========================================================================

    /**
     * @notice Anchors a cryptographic hash of a clinical record to the blockchain.
     * @param title Title of the document.
     * @param fileHash IPFS CID or SHA-256 hash of the encrypted file.
     * @param category Classification of the report.
     * @param patientEmailHash Keccak256 hash of patient email for privacy-preserving lookup.
     */
    function anchorRecord(
        string calldata title,
        string calldata fileHash,
        string calldata category,
        bytes32 patientEmailHash
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title is required");
        require(bytes(fileHash).length > 0, "File hash is required");
        require(hashToRecordId[fileHash] == 0, "Record hash already anchored");

        _recordIdCounter++;
        uint256 newId = _recordIdCounter;

        records[newId] = MedicalRecord({
            id: newId,
            title: title,
            fileHash: fileHash,
            category: category,
            timestamp: block.timestamp,
            patient: msg.sender,
            patientEmailHash: patientEmailHash
        });

        hashToRecordId[fileHash] = newId;
        _patientRecordIds[msg.sender].push(newId);

        emit RecordAnchored(newId, msg.sender, fileHash, title, category, block.timestamp);

        return newId;
    }

    /**
     * @notice Verifies whether a given file hash (CID) exists on-chain.
     * @param fileHash IPFS CID or SHA-256 digest to verify.
     */
    function verifyRecord(string calldata fileHash) external view returns (
        bool exists,
        uint256 recordId,
        string memory title,
        string memory category,
        uint256 timestamp,
        address patient
    ) {
        uint256 id = hashToRecordId[fileHash];
        if (id == 0) {
            return (false, 0, "", "", 0, address(0));
        }

        MedicalRecord storage rec = records[id];
        return (true, rec.id, rec.title, rec.category, rec.timestamp, rec.patient);
    }

    /**
     * @notice Retrieves all record IDs owned by the caller.
     */
    function getMyRecordIds() external view returns (uint256[] memory) {
        return _patientRecordIds[msg.sender];
    }

    /**
     * @notice Retrieves record IDs of a patient if the caller is authorized.
     * @param patient Address of the patient whose records are requested.
     */
    function getPatientRecordIds(address patient) external view returns (uint256[] memory) {
        require(
            msg.sender == patient || hasValidAccess(patient, msg.sender),
            "Access Denied: Not authorized to view patient records"
        );
        return _patientRecordIds[patient];
    }

    // =========================================================================
    // 2. PATIENT-CONTROLLED ACCESS PERMISSIONS
    // =========================================================================

    /**
     * @notice Grants permission to a doctor to inspect patient records.
     * @param doctor Address of the verified practitioner.
     * @param accessScope "Full Medical History", "Lab Reports Only", etc.
     * @param durationInSeconds Duration of grant (0 for indefinite until revoked).
     */
    function grantDoctorAccess(
        address doctor,
        string calldata accessScope,
        uint256 durationInSeconds
    ) external {
        require(doctor != address(0), "Invalid doctor address");
        require(doctor != msg.sender, "Cannot grant access to self");

        uint256 expiresAt = durationInSeconds > 0 ? block.timestamp + durationInSeconds : 0;

        permissions[msg.sender][doctor] = AccessGrant({
            isGranted: true,
            accessScope: accessScope,
            grantedAt: block.timestamp,
            expiresAt: expiresAt
        });

        emit AccessGranted(msg.sender, doctor, accessScope, expiresAt);
    }

    /**
     * @notice Instantly revokes permission from a doctor.
     * @param doctor Address of the doctor to revoke.
     */
    function revokeDoctorAccess(address doctor) external {
        require(permissions[msg.sender][doctor].isGranted, "No active permission found");

        delete permissions[msg.sender][doctor];

        emit AccessRevoked(msg.sender, doctor, block.timestamp);
    }

    /**
     * @notice Checks whether a doctor has valid, non-expired access to a patient's records.
     */
    function hasValidAccess(address patient, address doctor) public view returns (bool) {
        AccessGrant storage grant = permissions[patient][doctor];
        if (!grant.isGranted) {
            return false;
        }
        if (grant.expiresAt > 0 && block.timestamp > grant.expiresAt) {
            return false;
        }
        return true;
    }

    // =========================================================================
    // 3. DOCTOR REGISTRATION & CREDENTIAL VERIFICATION
    // =========================================================================

    /**
     * @notice Registers the calling address as a doctor node.
     */
    function registerDoctor(
        string calldata fullname,
        string calldata licenseNumber,
        string calldata specialization
    ) external {
        require(bytes(fullname).length > 0, "Fullname required");
        require(bytes(licenseNumber).length > 0, "License required");

        doctors[msg.sender] = Doctor({
            doctorAddress: msg.sender,
            fullname: fullname,
            licenseNumber: licenseNumber,
            specialization: specialization,
            isVerified: false,
            registeredAt: block.timestamp
        });

        emit DoctorRegistered(msg.sender, fullname, licenseNumber, specialization);
    }

    /**
     * @notice Verifies a doctor's medical council credentials.
     */
    function verifyDoctor(address doctorAddress) external onlyVerifier {
        require(doctors[doctorAddress].doctorAddress != address(0), "Doctor not registered");
        doctors[doctorAddress].isVerified = true;
        emit DoctorVerified(doctorAddress, msg.sender, block.timestamp);
    }

    /**
     * @notice Authorizes a hospital or regulatory node to verify doctors.
     */
    function setVerifier(address verifier, bool status) external onlyOwner {
        authorizedVerifiers[verifier] = status;
    }
}
