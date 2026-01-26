package com.task_collab;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.task_collab.dto.AddItemRequest;
import com.task_collab.dto.CreateListRequest;
import com.task_collab.dto.StatusModificationRequest;
import com.task_collab.entities.ItemStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ListControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void getList_notFound_returns404() throws Exception {
        mockMvc.perform(get("/lists/{id}", UUID.randomUUID()))
                .andExpect(status().isNotFound());
    }

    UUID createMyList() throws Exception {
        CreateListRequest request = new CreateListRequest("My list");

        MvcResult result = mockMvc.perform(post("/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String location = result.getResponse().getHeader("Location");

        String idFromLocation = location.substring(location.lastIndexOf("/") + 1);

        return UUID.fromString(idFromLocation);
    }

    @Test
    void createList_success() throws Exception {
        UUID listId = createMyList();

        mockMvc.perform(get("/lists/{id}", listId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(listId.toString()))
                .andExpect(jsonPath("$.title").value("My list"));
    }

    @Test
    void createList_validationError() throws Exception {
        CreateListRequest request = new CreateListRequest("");

        mockMvc.perform(post("/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    CreatedItem addItem() throws Exception {
        UUID listId = createMyList();
        AddItemRequest request = new AddItemRequest("item 1");

        MvcResult result = mockMvc.perform(post("/lists/{id}/items", listId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String location = result.getResponse().getHeader("Location");

        String idFromLocation = location.substring(location.lastIndexOf("/") + 1);

        return new CreatedItem(listId, UUID.fromString(idFromLocation));
    }

    @Test
    void addItem_success() throws Exception {
        CreatedItem createdItem = addItem();

        mockMvc.perform(get("/lists/{id}/items/{itemId}", createdItem.listId(), createdItem.itemId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdItem.itemId().toString()))
                .andExpect(jsonPath("$.name").value("item 1"));

    }

    @Test
    void addItem_validationError() throws Exception {
        UUID listId = createMyList();
        AddItemRequest request = new AddItemRequest("");

        mockMvc.perform(post("/lists/{id}/items", listId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void markItemDone_success() throws Exception {
        CreatedItem createdItem = addItem();

        StatusModificationRequest request = new StatusModificationRequest(ItemStatus.DONE);

        mockMvc.perform(patch("/lists/{id}/items/{itemId}", createdItem.listId(), createdItem.itemId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());
    }

    @Test
    void modifyItem_invalidStatus_returns400() throws Exception {
        CreatedItem createdItem = addItem();

        mockMvc.perform(patch("/lists/{id}/items/{itemId}", createdItem.listId(), createdItem.itemId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "status": "INVALID" }
                        """))
                    .andExpect(status().isBadRequest());
    }

}
