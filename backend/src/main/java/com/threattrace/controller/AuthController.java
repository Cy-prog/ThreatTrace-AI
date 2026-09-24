package com.threattrace.controller;

import com.threattrace.dto.request.LoginRequest;
import com.threattrace.dto.request.RegisterRequest;
import com.threattrace.dto.response.AuthResponse;
import com.threattrace.dto.response.UserProfileResponse;
import com.threattrace.entity.Role;
import com.threattrace.entity.User;
import com.threattrace.exception.RateLimitExceededException;
import com.threattrace.exception.ValidationException;
import com.threattrace.repository.RoleRepository;
import com.threattrace.repository.UserRepository;
import com.threattrace.security.JwtTokenProvider;
import com.threattrace.security.RateLimiterService;
import com.threattrace.security.UserPrincipal;
import com.threattrace.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication, registration, and token exchange")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RateLimiterService rateLimiterService;
    private final AuditService auditService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          RateLimiterService rateLimiterService,
                          AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.rateLimiterService = rateLimiterService;
        this.auditService = auditService;
    }

    @PostMapping("/login")
    @Operation(summary = "User login and JWT token issuance")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        if (!rateLimiterService.allowRequest(clientIp)) {
            auditService.record(loginRequest.getUsername(), "LOGIN_RATE_LIMITED", "AUTH", "login", clientIp, "{}");
            throw new RateLimitExceededException("Too many login requests. Please try again in one minute.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(loginRequest.getUsername());

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        UserProfileResponse userProfile = new UserProfileResponse(
                principal.getId(),
                principal.getUsername(),
                principal.getEmail(),
                principal.getFullName(),
                roles
        );

        auditService.record(principal.getUsername(), "LOGIN_SUCCESS", "AUTH", principal.getId(), clientIp, "{}");

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, tokenProvider.getExpirationMs() / 1000, userProfile));
    }

    @PostMapping("/register")
    @Operation(summary = "Self-registration for new security analysts")
    public ResponseEntity<UserProfileResponse> register(@Valid @RequestBody RegisterRequest regRequest, HttpServletRequest request) {
        if (userRepository.existsByUsername(regRequest.getUsername())) {
            throw new ValidationException("Username is already taken");
        }
        if (userRepository.existsByEmail(regRequest.getEmail())) {
            throw new ValidationException("Email is already registered");
        }

        User user = new User();
        user.setUsername(regRequest.getUsername());
        user.setEmail(regRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(regRequest.getPassword()));
        user.setFullName(regRequest.getFullName());
        user.setEnabled(true);

        Role analystRole = roleRepository.findByName("ROLE_ANALYST")
                .orElseGet(() -> roleRepository.save(new Role("r002-analyst", "ROLE_ANALYST", "Threat Analyst")));

        user.setRoles(Set.of(analystRole));
        User saved = userRepository.save(user);

        auditService.record(saved.getUsername(), "USER_REGISTERED", "USER", saved.getId(), request.getRemoteAddr(), "{}");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new UserProfileResponse(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getFullName(), List.of("ROLE_ANALYST")));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh expired JWT access token")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");
        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            throw new ValidationException("Invalid refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ValidationException("User not found for refresh token"));

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String newAccessToken = tokenProvider.generateAccessToken(auth);

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user identity and authorities")
    public ResponseEntity<UserProfileResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new UserProfileResponse(
                principal.getId(),
                principal.getUsername(),
                principal.getEmail(),
                principal.getFullName(),
                roles
        ));
    }
}
