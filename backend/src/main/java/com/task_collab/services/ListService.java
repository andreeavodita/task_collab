package com.task_collab.services;

import com.task_collab.entities.ItemEntity;
import com.task_collab.entities.ListEntity;
import com.task_collab.repositories.ListRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListService {

    private final ListRepository listRepository;

    public ListService(final ListRepository listRepository) {
        this.listRepository = listRepository;
    }

    @Transactional(readOnly = true)
    public List<ListEntity> getAllLists() {
        return listRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ListEntity getList(UUID id) {
        return listRepository.findById(id).orElseThrow();
    }

    @Transactional(readOnly = true)
    public ItemEntity getItem(UUID listId, UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        return list.getItem(itemId);
    }

    @Transactional
    public void createList(final String title) {
        ListEntity list = new ListEntity(title);
        listRepository.save(list);
    }

    @Transactional
    public void deleteList(UUID listId) {
        listRepository.deleteById(listId);
    }

    @Transactional
    public void renameList(final UUID listId, final String title) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.rename(title);
    }

    @Transactional
    public void addItem(final UUID listId, final String name) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.addItem(name);
    }

    @Transactional
    public void softDeleteItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.softDeleteItem(itemId);
    }

    @Transactional
    public void hardDeleteItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.hardDeleteItem(itemId);
    }

    @Transactional
    public void archiveItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.archiveItem(itemId);
    }

    @Transactional
    public void markItemDone(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.markItemDone(itemId);
    }

    @Transactional
    public void markItemActive(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow();
        list.markItemActive(itemId);
    }
}
