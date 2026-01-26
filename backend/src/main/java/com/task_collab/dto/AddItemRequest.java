package com.task_collab.dto;

import jakarta.validation.constraints.NotBlank;

public class AddItemRequest {

    @NotBlank
    private String name;

    public String getName() {
        return name;
    }

    protected AddItemRequest() {
        // for Jackson
    }

    public AddItemRequest(String name) {
        this.name = name;
    }
}
