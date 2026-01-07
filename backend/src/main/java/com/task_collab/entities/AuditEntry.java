package com.task_collab.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.Instant;
import java.util.UUID;

@Entity
public class AuditEntry {

    @Id
    @GeneratedValue
    private UUID id;
    private Instant occurredAt;
    private String action;
    private UUID listId;
    private UUID itemId;
    private String details;

    public AuditEntry(
            final String action,
            final UUID listId,
            final UUID itemId,
            final String details
    ) {
        this.occurredAt = Instant.now();
        this.action = action;
        this.listId = listId;
        this.itemId = itemId;
        this.details = details;
    }

    protected AuditEntry() {}

}
