package com.threattrace.service.notification;

public interface NotificationProvider {
    String getChannel();
    void sendNotification(String title, String message, Object payload);
}
