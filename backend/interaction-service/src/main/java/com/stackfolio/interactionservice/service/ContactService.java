package com.stackfolio.interactionservice.service;

import com.stackfolio.interactionservice.entity.Contact;
import com.stackfolio.interactionservice.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private KafkaTemplate<String, Contact> kafkaTemplate;

    private static final String CONTACT_TOPIC = "contact-events";

    @Transactional
    public Contact saveContact(Contact contact) {
        Contact savedContact = contactRepository.save(contact);

        // Send event to Kafka for notification service
        kafkaTemplate.send(CONTACT_TOPIC, savedContact);

        return savedContact;
    }
}