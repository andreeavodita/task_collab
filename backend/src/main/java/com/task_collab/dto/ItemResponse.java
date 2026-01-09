package com.task_collab.dto;

import com.task_collab.entities.ItemEntity;
import com.task_collab.entities.ItemStatus;

import java.time.Instant;
import java.util.UUID;

public class ItemResponse {

    private final UUID id;

    private final String name;

    private final ItemStatus status;

    private final Instant createdAt;

    private final Instant completedAt;

    private final Instant removedAt;

    private final Instant archivedAt;

    public ItemResponse(ItemEntity item) {
        this.id = item.getId();
        this.name = item.getName();
        this.status = item.getStatus();
        this.createdAt = item.getCreatedAt();
        this.completedAt = item.getCompletedAt();
        this.removedAt = item.getRemovedAt();
        this.archivedAt = item.getArchivedAt();
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

    public Instant getCompletedAt() {
        return completedAt;
    }

    public Instant getRemovedAt() {
        return removedAt;
    }

    public Instant getArchivedAt() {
        return archivedAt;
    }
}
