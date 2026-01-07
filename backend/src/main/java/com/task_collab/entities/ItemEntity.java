package com.task_collab.entities;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
public class ItemEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    private Instant createdAt;

    private Instant completedAt;

    private Instant removedAt;

    private Instant archivedAt;

    @ManyToOne
    private ListEntity list;


    public ItemEntity(final String name) {
        this.name = name;
        this.status = ItemStatus.ACTIVE;
        this.createdAt = Instant.now();
        this.completedAt = null;
        this.removedAt = null;
        this.archivedAt = null;
    }

    protected ItemEntity() {}

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void markDone() {
        if (this.status != ItemStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Only ACTIVE items can be marked as DONE");
        }

        this.status = ItemStatus.DONE;
        this.completedAt = Instant.now();
    }

    public void markActive() {
        if (this.status != ItemStatus.DONE) {
            throw new IllegalStateException(
                    "Only DONE items can be marked as ACTIVE");
        }

        this.status = ItemStatus.ACTIVE;
        this.completedAt = null;
    }

    public void restore() {
        if (this.status != ItemStatus.REMOVED) {
            throw new IllegalStateException(
                    "Only REMOVED items can be restored");
        }
        this.status = this.completedAt == null
                ? ItemStatus.ACTIVE
                : ItemStatus.DONE;
        this.removedAt = null;
        this.archivedAt = null;
    }

    public void remove() {
        if (this.status == ItemStatus.ARCHIVED) {
            throw new IllegalStateException(
                    "Archived items cannot be removed");
        }
        if (this.status == ItemStatus.REMOVED) {
            return; // idempotent
        }
        this.status = ItemStatus.REMOVED;
        this.removedAt = Instant.now();
    }

    public void archive() {
        if (this.status != ItemStatus.DONE) {
            throw new IllegalStateException("Only DONE items can be archived");
        }

        this.status = ItemStatus.ARCHIVED;
        this.archivedAt = Instant.now();
    }

    public void rename(final String name) {
        this.name = name;
    }

}
