package com.threattrace.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private static final int MAX_REQUESTS_PER_MINUTE = 20;
    private final Map<String, RequestBucket> clientBuckets = new ConcurrentHashMap<>();

    public boolean allowRequest(String clientIp) {
        long currentMinute = Instant.now().getEpochSecond() / 60;
        RequestBucket bucket = clientBuckets.compute(clientIp, (key, existing) -> {
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

        return bucket.count <= MAX_REQUESTS_PER_MINUTE;
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
