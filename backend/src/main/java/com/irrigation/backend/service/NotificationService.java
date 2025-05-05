package com.irrigation.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender emailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    // For a real application, you would store these in a database
    private final String[] adminEmails = {"peerbashapb044@gmail.com"};
    
    public void sendNotification(String subject, String message, String severity) {
        // Send email notification
        sendEmail(subject, message);
        
        // Add logic for other notification types (SMS, WhatsApp, etc.)
        if ("CRITICAL".equals(severity)) {
            // Example: Send SMS for critical alerts
            // sendSms(subject, message);
            log.info("Would send SMS for CRITICAL alert: {}", subject);
        }
    }
    
    private void sendEmail(String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(adminEmails);
            mailMessage.setSubject("Smart Irrigation Alert: " + subject);
            mailMessage.setText(message);
            
            emailSender.send(mailMessage);
            log.info("Email notification sent successfully");
        } catch (Exception e) {
            log.error("Failed to send email notification", e);
            throw new RuntimeException("Failed to send email notification", e);
        }
    }
    
    // Method stub for SMS integration
    private void sendSms(String subject, String message) {
        // Implement SMS sending logic using a third-party service like Twilio
        log.info("SMS notification would be sent: Subject={}, Message={}", subject, message);
    }
    
    // Method stub for WhatsApp integration
    private void sendWhatsAppMessage(String subject, String message) {
        // Implement WhatsApp sending logic using a third-party service like Twilio
        log.info("WhatsApp notification would be sent: Subject={}, Message={}", subject, message);
    }
} 