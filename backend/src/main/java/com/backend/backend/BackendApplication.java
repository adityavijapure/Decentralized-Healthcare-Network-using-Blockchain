package com.backend.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * HealthChain — Decentralized Healthcare Network using Blockchain
 * 
 * Enterprise Java Spring Boot backend connecting Ethereum Web3 smart contracts,
 * SHA-256 tamper verification, and Neon Serverless PostgreSQL.
 * 
 * @author Aditya Vijapure <adityavijapure0508@gmail.com>
 * @copyright (c) 2026 Aditya Vijapure. All rights reserved.
 * @license MIT License
 */
@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
