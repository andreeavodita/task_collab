package com.task_collab.dto;

import com.task_collab.entities.ItemEntity;
import com.task_collab.entities.ListEntity;

import java.util.List;
import java.util.UUID;

public class ListResponse {
    private final UUID id;

    private final String title;

    private final List<ItemEntity> items;

    public ListResponse(UUID id, String title, List<ItemEntity> items) {
        this.id = id;
        this.title = title;
        this.items = items;
    }

    public ListResponse(ListEntity list) {
        this.id = list.getId();
        this.title = list.getTitle();
        this.items = list.getItems();
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public List<ItemEntity> getItems() {
        return items;
    }
}
