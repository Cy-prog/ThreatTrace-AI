package com.threattrace.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private static final int DEFAULT_MAX_REQUESTS_PER_MINUTE = 20;
    private final Map<String, RequestBucket> clientBuckets = new ConcurrentHashMap<>();

    public boolean allowRequest(String clientIp) {
        return allowRequest(clientIp, DEFAULT_MAX_REQUESTS_PER_MINUTE);
    }

    public boolean allowRequest(String clientKey, int maxRequestsPerMinute) {
        if (clientKey == null) clientKey = "unknown";
        long currentMinute = Instant.now().getEpochSecond() / 60;
        RequestBucket bucket = clientBuckets.compute(clientKey, (key, existing) -> {
            if (existing == null || existing.minuteWindow != currentMinute) {
                return new RequestBucket(currentMinute, 1);
            }
            existing.count++;
            return existing;
        });

        // Periodic cleanup
        if (clientBuckets.size() > 5000) {
            clientBuckets.entrySet().removeIf(e -> e.getValue().minuteWindow < currentMinute - 2);
        }

        return bucket.count <= maxRequestsPerMinute;
    }

    public static String resolveClientIp(jakarta.servlet.http.HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String xForwarded = request.getHeader("X-Forwarded-For");
        if (xForwarded != null && !xForwarded.isBlank()) {
            return xForwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }

    private static class RequestBucket {
        long minuteWindow;
        int count;

        RequestBucket(long minuteWindow, int count) {
            this.minuteWindow = minuteWindow;
            this.count = count;
        }
    }
}
