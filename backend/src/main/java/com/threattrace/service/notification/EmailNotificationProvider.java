package com.threattrace.service.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationProvider implements NotificationProvider {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationProvider.class);

    @Value("${threattrace.mail.enabled:false}")
    private boolean mailEnabled;

    @Override
    public String getChannel() {
        return "EMAIL";
    }

    @Override
    public void sendNotification(String title, String message, Object payload) {
        if (!mailEnabled) {
            logger.info("[MOCK EMAIL ALERT] Subject: {} | Content: {}", title, message);
            return;
        }
        logger.info("Dispatching external SMTP alert: {}", title);
    }
}
