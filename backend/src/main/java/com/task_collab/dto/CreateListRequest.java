package com.task_collab.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateListRequest {

    @NotBlank
    private String title;

    public String getTitle() {
        return title;
    }
}
