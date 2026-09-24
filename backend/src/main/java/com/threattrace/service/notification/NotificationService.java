package com.threattrace.service.notification;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final List<NotificationProvider> providers;

    public NotificationService(List<NotificationProvider> providers) {
        this.providers = providers;
    }

    public void dispatch(String title, String message, Object payload) {
        for (NotificationProvider provider : providers) {
            provider.sendNotification(title, message, payload);
        }
    }
}
