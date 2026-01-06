import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ListEntity {

    private UUID id;

    private String title;

    private final List<ItemEntity> items = new ArrayList<>();

    private Instant createdAt;

    private final List<AuditEntry> auditLog = new ArrayList<>();

    public ListEntity(final String title) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.createdAt = Instant.now();
    }

    protected ListEntity() {}

    public List<ItemEntity> getItems() {
        return List.copyOf(items);
    }

    public List<AuditEntry> getAuditLog() {
        return List.copyOf(auditLog);
    }

    public void addItem(final String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Item name cannot be empty");
        }

        ItemEntity newItem = new ItemEntity(name);
        items.add(newItem);

        auditLog.add(new AuditEntry(
                "ITEM_CREATED",
                this.id,
                newItem.getId(),
                "Item created with name: " + name
        ));
    }

    public void hardDeleteItem(final UUID itemId) {
        items.remove(findItem(itemId));

        auditLog.add(new AuditEntry(
                "ITEM_HARD_DELETED",
                this.id,
                itemId,
                null
        ));
    }

    public void rename(final String title) {
        this.title = title;
    }

    private ItemEntity findItem(final UUID itemId) {
        return items.stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    }

    public void markItemDone(final UUID itemId) {
        findItem(itemId).markDone();

        auditLog.add(new AuditEntry(
                "ITEM_MARKED_DONE",
                this.id,
                itemId,
                null
        ));
    }

    public void markItemActive(final UUID itemId) {
        findItem(itemId).markActive();

        auditLog.add(new AuditEntry(
                "ITEM_MARKED_ACTIVE",
                this.id,
                itemId,
                null
        ));
    }

    public void removeItem(final UUID itemId) {
        findItem(itemId).remove();

        auditLog.add(new AuditEntry(
                "ITEM_REMOVED",
                this.id,
                itemId,
                null
        ));
    }

    public void archiveItem(final UUID itemId) {
        findItem(itemId).archive();

        auditLog.add(new AuditEntry(
                "ITEM_MARKED_ARCHIVED",
                this.id,
                itemId,
                null
        ));
    }
}
