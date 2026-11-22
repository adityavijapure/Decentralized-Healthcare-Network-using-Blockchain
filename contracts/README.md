# 📜 HealthChain Smart Contracts

This directory contains the Solidity smart contracts powering the decentralized ledger tier of **HealthChain**.

---

## 📄 Contract Overview: `HealthChain.sol`

`HealthChain.sol` is an Ethereum smart contract written in **Solidity `^0.8.20`** designed for:

1. **Cryptographic Record Anchoring**:
   - `anchorRecord(title, fileHash, category, patientEmailHash)`: Anchors an immutable SHA-256 / IPFS CID hash of a patient's medical file.
   - `verifyRecord(fileHash)`: Verifies whether a clinical record's hash exists on the Ethereum ledger, returning timestamp, category, and patient address.
   - `getMyRecordIds()` / `getPatientRecordIds(patient)`: Returns list of record IDs owned by or accessible to the caller.

2. **Self-Sovereign Access Permissions**:
   - `grantDoctorAccess(doctorAddress, accessScope, duration)`: Patient authorizes a licensed doctor with a specific scope ("Full Medical History", "Lab Reports Only") and optional expiration.
   - `revokeDoctorAccess(doctorAddress)`: Patient revokes access with an on-chain state update.
   - `hasValidAccess(patient, doctor)`: Checks whether a doctor has valid, non-expired access.

3. **Doctor Verification & Registry**:
   - `registerDoctor(fullname, licenseNumber, specialization)`: Registers practitioner on-chain.
   - `verifyDoctor(doctorAddress)`: Hospital or regulatory authority approves doctor credentials.

---

## 🚀 How to Deploy

### Option A: Deploy via Remix IDE (Easiest & Fastest for Sepolia)
1. Open [Remix IDE](https://remix.ethereum.org/).
2. In the `contracts/` workspace, create `HealthChain.sol` and paste the contents of [`contracts/HealthChain.sol`](./HealthChain.sol).
3. In the **Solidity Compiler** tab, select compiler version `0.8.20` or higher and click **Compile HealthChain.sol**.
4. In the **Deploy & Run Transactions** tab:
   - Environment: Select **"Injected Provider - MetaMask"**.
   - Ensure your MetaMask is connected to **Ethereum Sepolia Testnet** (Chain ID: `11155111`).
   - Click **Deploy** and confirm the transaction in MetaMask.
5. Once confirmed, copy the deployed contract address (e.g., `0x1234...abcd`).
6. Update your `frontend/.env` and root `.env`:
   ```env
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

---

### Option B: Deploy via Hardhat Local Node
If you are running a local Hardhat node on port `8545`:
```bash
# Install hardhat if not installed
npx hardhat node
```
The default deployed first contract address is usually `0x5FbDB2315678afecb367f032d93F642f64180aa3`, which is already set in:
- `frontend/.env`: `VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3`
