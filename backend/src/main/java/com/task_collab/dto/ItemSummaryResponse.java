package com.task_collab.dto;

import com.task_collab.entities.ItemStatus;

import java.time.Instant;
import java.util.UUID;

public class ItemSummaryResponse {
    private final UUID id;

    private final String name;

    private final ItemStatus status;

    private final Instant createdAt;


    public ItemSummaryResponse(UUID id, String name, ItemStatus status, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
