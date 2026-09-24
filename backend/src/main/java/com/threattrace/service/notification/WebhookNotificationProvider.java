package com.threattrace.service.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class WebhookNotificationProvider implements NotificationProvider {

    private static final Logger logger = LoggerFactory.getLogger(WebhookNotificationProvider.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${threattrace.notifications.webhook-url:}")
    private String webhookUrl;

    @Override
    public String getChannel() {
        return "WEBHOOK";
    }

    @Override
    @Async
    public void sendNotification(String title, String message, Object payload) {
        if (webhookUrl == null || webhookUrl.isBlank()) {
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("event", title);
            body.put("text", message);
            body.put("data", payload);
            body.put("timestamp", System.currentTimeMillis());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(webhookUrl, entity, String.class);
            logger.info("Successfully posted outbound webhook alert to {}", webhookUrl);
        } catch (Exception ex) {
            logger.warn("Failed to deliver webhook notification to {}: {}", webhookUrl, ex.getMessage());
        }
    }
}
