package com.task_collab.entities;

import java.time.Instant;
import java.util.UUID;

public class AuditEntry {

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
