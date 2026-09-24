package com.threattrace;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.threattrace.dto.request.LoginRequest;
import com.threattrace.dto.request.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAdminLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest("admin@threattrace.io", "AdminPass123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("admin@threattrace.io"))
                .andExpect(jsonPath("$.user.roles[0]").exists());
    }

    @Test
    void testAnalystLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest("analyst@threattrace.io", "AnalystPass123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("analyst@threattrace.io"));
    }

    @Test
    void testLoginWithBadCredentialsFails() throws Exception {
        LoginRequest req = new LoginRequest("admin@threattrace.io", "WrongPassword!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("AUTHENTICATION_FAILED"));
    }

    @Test
    void testRegistrationFlow() throws Exception {
        String testUser = "analyst_" + System.currentTimeMillis();
        RegisterRequest req = new RegisterRequest();
        req.setUsername(testUser);
        req.setEmail(testUser + "@cybersecurity.org");
        req.setPassword("ValidSecurePass123!");
        req.setFullName("Junior Analyst");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value(testUser))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_ANALYST"));
    }
}
