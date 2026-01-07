package com.task_collab.entities;

import java.time.Instant;
import java.util.UUID;

public class AuditEntry {
    private final UUID id;
    private final Instant occuredAt;
    private final String action;
    private final UUID listId;
    private final UUID itemId;
    private final String details;

    public AuditEntry(
            final String action,
            final UUID listId,
            final UUID itemId,
            final String details
    ) {
        this.id = UUID.randomUUID();
        this.occuredAt = Instant.now();
        this.action = action;
        this.listId = listId;
        this.itemId = itemId;
        this.details = details;
    }
}
