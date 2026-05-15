package com.stackfolio.notificationservice.consumer;

import com.stackfolio.notificationservice.dto.Contact;
import com.stackfolio.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ContactEventConsumer {

    @Autowired
    private EmailService emailService;

    @KafkaListener(topics = "contact-events", groupId = "notification-service")
    public void handleContactEvent(Contact contact) {
        try {
            // Send notification to portfolio owner
            emailService.sendContactNotification(contact);

            // Send auto-reply to the contact
            emailService.sendAutoReply(contact);
        } catch (Exception e) {
            // Log error - in production, implement proper error handling
            System.err.println("Error processing contact event: " + e.getMessage());
        }
    }
}