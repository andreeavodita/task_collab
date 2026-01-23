package com.task_collab.dto;

import java.time.Instant;
import java.util.UUID;

public class ListSummaryResponse {
    private final UUID id;

    private final String title;

    private final Integer itemCount;

    private final Instant createdAt;


    public ListSummaryResponse(UUID id, String title, Integer itemCount, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.itemCount = itemCount;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
