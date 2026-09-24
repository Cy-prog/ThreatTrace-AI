package com.threattrace;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class ThreatTraceApplicationTests {

    @Test
    void contextLoads() {
        // Validates Spring Boot context initialization, Flyway migration execution, and bean wiring
    }
}
