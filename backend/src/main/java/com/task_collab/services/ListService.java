package com.task_collab.services;

import com.task_collab.entities.ItemEntity;
import com.task_collab.entities.ListEntity;
import com.task_collab.exceptions.NotFoundException;
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
        return listRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    @Transactional(readOnly = true)
    public ItemEntity getItem(UUID listId, UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        return list.findItem(itemId);
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
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.rename(title);
    }

    @Transactional
    public void addItem(final UUID listId, final String name) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.addItem(name);
    }

    @Transactional
    public void renameItem(final UUID listId, final UUID itemId, final String name) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.renameItem(itemId, name);
    }

    @Transactional
    public void restoreItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.restoreItem(itemId);
    }

    @Transactional
    public void softDeleteItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.softDeleteItem(itemId);
    }

    @Transactional
    public void hardDeleteItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.hardDeleteItem(itemId);
    }

    @Transactional
    public void archiveItem(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.archiveItem(itemId);
    }

    @Transactional
    public void markItemDone(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.markItemDone(itemId);
    }

    @Transactional
    public void markItemActive(final UUID listId, final UUID itemId) {
        ListEntity list = listRepository.findById(listId).orElseThrow(NotFoundException::new);
        list.markItemActive(itemId);
    }
}
