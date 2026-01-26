package com.task_collab.dto;

import com.task_collab.entities.ItemStatus;
import jakarta.validation.constraints.NotNull;

public class StatusModificationRequest {

    @NotNull
    private ItemStatus status;

    public ItemStatus getStatus() {
        return status;
    }

    public StatusModificationRequest(ItemStatus status) {
        this.status = status;
    }

    protected StatusModificationRequest() {
        // for Jackson
    }
}
