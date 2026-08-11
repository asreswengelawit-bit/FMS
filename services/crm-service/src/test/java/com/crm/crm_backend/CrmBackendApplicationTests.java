package com.crm.crm_backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Smoke check that avoids loading the full Spring context
 * (needs Neon Postgres + RabbitMQ). Use slice/unit tests for behavior.
 */
class CrmBackendApplicationTests {

	@Test
	void applicationClassIsPresent() {
		assertNotNull(CrmBackendApplication.class);
	}
}
