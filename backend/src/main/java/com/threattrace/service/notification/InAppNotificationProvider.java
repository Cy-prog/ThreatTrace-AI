package com.threattrace.service.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class InAppNotificationProvider implements NotificationProvider {

    private static final Logger logger = LoggerFactory.getLogger(InAppNotificationProvider.class);
    private final SimpMessagingTemplate messagingTemplate;

    public InAppNotificationProvider(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public String getChannel() {
        return "IN_APP";
    }

    @Override
    public void sendNotification(String title, String message, Object payload) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("title", title);
            event.put("message", message);
            event.put("payload", payload);
            event.put("timestamp", System.currentTimeMillis());

            messagingTemplate.convertAndSend("/topic/events", event);
            logger.debug("Dispatched in-app WebSocket notification: {}", title);
        } catch (Exception ex) {
            logger.warn("Failed to dispatch WebSocket event: {}", ex.getMessage());
        }
    }
}
