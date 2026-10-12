// Centralized Environment & API Configuration for HealthChain Frontend

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";
export const BLOCKCHAIN_RPC_URL = import.meta.env.VITE_BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "11155111";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
export const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "d17ac6a9-e2ac-41ca-872e-4a58e78bf77a";

export default {
  API_BASE_URL,
  BLOCKCHAIN_RPC_URL,
  CHAIN_ID,
  CONTRACT_ADDRESS,
  IPFS_GATEWAY,
  WEB3FORMS_ACCESS_KEY,
};
