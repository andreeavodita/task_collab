package com.task_collab.controllers;

import com.task_collab.dto.AddItemRequest;
import com.task_collab.dto.CreateListRequest;
import com.task_collab.dto.ItemResponse;
import com.task_collab.dto.ListResponse;
import com.task_collab.dto.StatusModificationRequest;
import com.task_collab.entities.ListEntity;
import com.task_collab.services.ListService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/lists")
public class ListController {

    private final ListService listService;

    public ListController(ListService listService) {
        this.listService = listService;
    }

    @GetMapping("/{id}")
    public ListResponse getList(@PathVariable UUID id) {
        return new ListResponse(listService.getList(id));
    }

    @GetMapping
    public Page<ListResponse> getAllLists(Pageable pageable) {
        return listService.getAllLists(pageable).map(ListResponse::new);
    }

    @DeleteMapping("/{id}")
    public void deleteList(@PathVariable UUID id) {
        listService.deleteList(id);
    }

    @PostMapping
    public void createList(@Valid @RequestBody CreateListRequest request) {
        listService.createList(request.getTitle());
    }

    @PutMapping("/{id}")
    public void renameList(@PathVariable UUID id, @Valid @RequestBody CreateListRequest request) {
        listService.renameList(id, request.getTitle());
    }

    @PostMapping("/{id}/items")
    public void addItem(@PathVariable UUID id, @Valid @RequestBody AddItemRequest request) {
        listService.addItem(id, request.getName());
    }

    @PutMapping("/{id}/items/{itemId}")
    public void renameItem(@PathVariable UUID id,
                           @PathVariable UUID itemId,
                           @Valid @RequestBody AddItemRequest request) {
        listService.renameItem(id, itemId, request.getName());
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public void deleteItem(@PathVariable UUID id,
                           @PathVariable UUID itemId) {
        listService.hardDeleteItem(id, itemId);
    }

    @PatchMapping("/{id}/items/{itemId}")
    public ItemResponse modifyItemStatus(@PathVariable UUID id,
                                         @PathVariable UUID itemId,
                                         @Valid @RequestBody StatusModificationRequest request) {

        switch (request.getStatus()) {
            case ACTIVE -> listService.markItemActive(id, itemId);
            case DONE -> listService.markItemDone(id, itemId);
            case REMOVED -> listService.softDeleteItem(id, itemId);
            case ARCHIVED -> listService.archiveItem(id, itemId);
        }

        return new ItemResponse(listService.getItem(id, itemId));
    }

    @PostMapping("/{id}/items/{itemId}/restore")
    public ItemResponse restoreItem(@PathVariable UUID id,
                                    @PathVariable UUID itemId) {
        listService.restoreItem(id, itemId);

        return new ItemResponse(listService.getItem(id, itemId));
    }

}
