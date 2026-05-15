package com.stackfolio.notificationservice.dto;

import java.time.LocalDateTime;

/**
 * Kafka payload DTO for contact events.
 * Must match the JSON shape produced by interaction-service's Contact entity.
 */
public class Contact {
    private Integer id;
    private String name;
    private String email;
    private String message;
    private LocalDateTime createdAt;

    // Required for Jackson deserialization
    public Contact() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

