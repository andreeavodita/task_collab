package com.task_collab.controllers;

import com.task_collab.dto.AddItemRequest;
import com.task_collab.dto.CreateListRequest;
import com.task_collab.dto.ListResponse;
import com.task_collab.dto.ListSummaryResponse;
import com.task_collab.dto.StatusModificationRequest;
import com.task_collab.services.ListService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/lists")
public class ListController {

    private final ListService listService;

    public ListController(ListService listService) {
        this.listService = listService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListResponse> getList(@PathVariable UUID id) {
        return ResponseEntity.ok(new ListResponse(listService.getList(id)));
    }

    @GetMapping
    public ResponseEntity<Page<ListSummaryResponse>> getAllLists(Pageable pageable) {
        return ResponseEntity.ok(listService.getAllLists(pageable).map(list ->
                new ListSummaryResponse(list.getId(), list.getTitle(), list.getItems().size(), list.getCreatedAt())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable UUID id) {
        listService.deleteList(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Void> createList(@Valid @RequestBody CreateListRequest request) {
        UUID id = listService.createList(request.getTitle());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> renameList(@PathVariable UUID id, @Valid @RequestBody CreateListRequest request) {
        listService.renameList(id, request.getTitle());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<Void> addItem(@PathVariable UUID id, @Valid @RequestBody AddItemRequest request) {
        UUID itemId = listService.addItem(id, request.getName());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{itemId}")
                .buildAndExpand(itemId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}/items/{itemId}")
    public ResponseEntity<Void> renameItem(@PathVariable UUID id,
                           @PathVariable UUID itemId,
                           @Valid @RequestBody AddItemRequest request) {
        listService.renameItem(id, itemId, request.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id,
                           @PathVariable UUID itemId) {
        listService.hardDeleteItem(id, itemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/items/{itemId}")
    public ResponseEntity<Void> modifyItemStatus(@PathVariable UUID id,
                                         @PathVariable UUID itemId,
                                         @Valid @RequestBody StatusModificationRequest request) {

        switch (request.getStatus()) {
            case ACTIVE -> listService.markItemActive(id, itemId);
            case DONE -> listService.markItemDone(id, itemId);
            case REMOVED -> listService.softDeleteItem(id, itemId);
            case ARCHIVED -> listService.archiveItem(id, itemId);
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/items/{itemId}/restore")
    public ResponseEntity<Void> restoreItem(@PathVariable UUID id,
                                    @PathVariable UUID itemId) {
        listService.restoreItem(id, itemId);

        return ResponseEntity.noContent().build();
    }

}
