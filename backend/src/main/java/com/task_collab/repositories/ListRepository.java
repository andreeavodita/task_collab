package com.task_collab.repositories;

import com.task_collab.entities.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ListRepository extends JpaRepository<ListEntity, UUID> {
}
