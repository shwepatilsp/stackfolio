package com.stackfolio.notificationservice.service;

import com.stackfolio.notificationservice.dto.Contact;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendContactNotification(Contact contact) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("your-email@example.com"); // Replace with your email
        message.setSubject("New Contact Form Submission");
        message.setText(String.format(
            "New contact from: %s (%s)\n\nMessage:\n%s",
            contact.getName(),
            contact.getEmail(),
            contact.getMessage()
        ));

        mailSender.send(message);
    }

    public void sendAutoReply(Contact contact) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(contact.getEmail());
        message.setSubject("Thank you for contacting me!");
        message.setText(String.format(
            "Hi %s,\n\nThank you for reaching out! I've received your message and will get back to you soon.\n\nBest regards,\nYour Name",
            contact.getName()
        ));

        mailSender.send(message);
    }
}