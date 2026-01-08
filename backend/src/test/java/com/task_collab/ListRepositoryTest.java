package com.task_collab;

import com.task_collab.entities.ListEntity;
import com.task_collab.repositories.ListRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ListRepositoryTest {

    @Autowired
    private ListRepository listRepository;

    @Test
    void saveAndFindByIdWorks() {
        ListEntity list = new ListEntity("My first list");

        ListEntity saved = listRepository.save(list);
        UUID id = saved.getId();

        assertThat(id).isNotNull();

        ListEntity loaded = listRepository.findById(id).orElseThrow();
        assertThat(loaded.getTitle()).isEqualTo("My first list");
    }
}
