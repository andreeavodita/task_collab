import { createContext, useContext, useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'
import useKeyboardShortcut from './keyboard-shortcut.jsx'
import trash from './assets/trashcan.svg';
import restorearrow from "./assets/restore-arrow.svg"
import { ITEM_STATUS } from './item-status.jsx'

const DAY = 60_000 * 60 * 24;
const SEVEN_DAYS = 60_000 * 60 * 24 * 7;

const ITEMS = [
  {id: 1, name: "Milk", status: ITEM_STATUS.ACTIVE},
  {id: 2, name: "Bread", status: ITEM_STATUS.DONE, completedAt: Date.now() - 2 * DAY},
  {id: 3, name: "Pumpkin", status: ITEM_STATUS.ACTIVE},
  {id: 4, name: "Clean the kitchen", status: ITEM_STATUS.ACTIVE},
  {id: 5, name: "Wash clothes", status: ITEM_STATUS.DONE, completedAt: Date.now() - 8 * DAY},
  {id: 6, name: "Bananas", status: ITEM_STATUS.ARCHIVED},
  {id: 7, name: "Apples", status: ITEM_STATUS.REMOVED, removedAt: Date.now() - 31 * DAY},
  {id: 8, name: "Pears", status: ITEM_STATUS.REMOVED, removedAt: Date.now() - 20 * DAY},
]

const LISTS = [
  {id: 1, title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2], ITEMS[5], ITEMS[6], ITEMS[7]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
  // {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},

  {id:2, title: "TO DOs", items: [ITEMS[3], ITEMS[4]]}
];

const ListsContext = createContext(null);

function DeleteButton({ historyDispatch, item, listId }) {
  return <button className='deleteitembutton'
                 onClick={item.status === ITEM_STATUS.REMOVED ? 
                  () => {
                    if (window.confirm("This item will be permanently deleted."))
                      historyDispatch({type: "hardDeleteItem", listId: listId, itemId: item.id})
                  } 
                  :
                  () =>
                    historyDispatch({type: "softDeleteItem", listId: listId, itemId: item.id})
                }>
                 <img src={trash} alt="Trash" />
                 </button>
}

function RestoreButton({ historyDispatch, listId, itemId }) {
  return <button className='restoreitembutton'
          onClick={() => historyDispatch({type: "restoreItem", listId: listId, itemId: itemId})}>
            <img src={restorearrow} alt="Restore Arrow"/>
          </button>

}

{/*
  Later I will have more than one list item.
  The "recently removed" one should be special:
  - has a restore button
  - does not edit inline, but shows a confirmation popup
  - delete button performs hard delete
*/}

function ListItem({item, listId, onToggle }) {

  const {
    historyDispatch,
    editingItem,
    setEditingItem
  } = useContext(ListsContext);

  const isChecked = item.status === ITEM_STATUS.DONE;
  const isRemoved = item.status === ITEM_STATUS.REMOVED;
  const [draftName, setDraftName] = useState(item.name);

  const isEditing = editingItem?.listId === listId && 
                    editingItem?.itemId === item.id;

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <li className={`list-item-${isChecked ? "done" : ""}`}>

      {
        isRemoved ? 
          <input
            type="checkbox"
            checked={isChecked}
            readOnly={true}
          />
          :
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
          />
      }

      {
        isEditing ? (
          <input className="item-name"  
                  ref={inputRef}
                  onChange={
                    (e) => setDraftName(e.target.value)
                  }
                  onBlur={() => {
                    setDraftName(item.name);
                    setEditingItem(null);
                  }}
                  onKeyDown={
                    (e) => {
                      if (e.key === "Enter") {
                        historyDispatch({type: "editItem", listId: listId, itemId: item.id, name: draftName});
                        setEditingItem(null);
                      }
                      if (e.key === "Escape") {
                        setDraftName(item.name);
                        setEditingItem(null);
                      }
                    }
                  }
                  value={draftName}
          />
        ) : (
          <span className="item-name" onClick={() => {
            setEditingItem({listId, itemId: item.id});
            setDraftName(item.name)
          }}>
            {item.name}
          </span>
        )
      }

      {
        isRemoved ?
          <RestoreButton
            historyDispatch={historyDispatch} 
            itemId={item.id} 
            listId={listId}
          />
          : null
      }

      <DeleteButton 
        historyDispatch={historyDispatch} 
        item={item} 
        listId={listId}
      />
    </li>
  )
}

function List({ listId, items }) {

  const { historyDispatch } = useContext(ListsContext);

  return (
    <ul>
      {items.filter(item => item.status === ITEM_STATUS.ACTIVE)
      .map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          listId={listId}
          onToggle={() => historyDispatch({type: "toggleItem", listId: listId, itemId: item.id})}
        />
      ))}  
      {items.filter(item => item.status === ITEM_STATUS.DONE)
      .map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          listId={listId}
          onToggle={() => historyDispatch({type: "toggleItem", listId: listId, itemId: item.id})}
        />
      ))}  
    </ul>
  );
}

function ListTitle({title}) {
  return <h2 className='list-title'>{title}</h2>
}

function TitledList({ list }) {

  const { historyDispatch } = useContext(ListsContext);

  return (
    <div className='list-card'>
      <ListTitle title={list.title}/>
      <div className='list-divider'/>
      <List 
          listId={list.id} 
          items={list.items}
          />
      <input
          type="checkbox"
          checked={false}
          readOnly={true}
      />
      <input
        type="text"
        onKeyDown={
          (e) => {
            if (e.key === "Enter") {
              historyDispatch({type: "addItem", listId: list.id, name: e.target.value});
              e.target.value = "";
            }
          }
        }
      />
    </div>
  )
}

function RecentlyRemovedView({ lists }) {
  return (
    <div className='recently-removed-title-list'>
      <ListTitle title={"Recently Removed"}/>
      <div className='list-divider'/>
      <ul>
        {lists.map(list =>
          list.items
          .filter(item => item.status === ITEM_STATUS.REMOVED)
          .map(item => (
            <ListItem 
              key={item.id} 
              item={item} 
              listId={list.id}
            />
          )))}  
      </ul>
    </div>
  );
}

function ListCollabSpace({ }) {

  const { present } = useContext(ListsContext)

  return (
    <div className="lists-grid">
      {present.map(list => (
        <TitledList 
            key={list.id} 
            list={list}
        />
      ))}
      <RecentlyRemovedView
        key={"recently-removed"}
        lists={present}
      />
    </div>
  )
}

export default function App() {
  const [editingItem, setEditingItem] = useState(null);
  const [history, historyDispatch] = useReducer(historyReducer, {past: [], present: LISTS, future: []});

  function toggleItem(state, {listId, itemId}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
        ...list,
        items: list.items.map(item =>
          item.id !== itemId
          ? item
          : {
            ...item,
            status: item.status === ITEM_STATUS.DONE ? ITEM_STATUS.ACTIVE : ITEM_STATUS.DONE,
            completedAt: item.status === ITEM_STATUS.ACTIVE ? Date.now() : null
          }
        )
      }
    );
  }

  function addItem(state, {listId, name}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
        ...list,
        items: [...list.items, 
          {
            id: list.items.length !== 0 ? (list.items[list.items.length - 1].id + 1) : 1,
            name: name,
            status: ITEM_STATUS.ACTIVE
          }
        ]
      }
    );
  }

  function restoreItem(state, {listId, itemId}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
        ...list,
        items: list.items.map(item =>
          item.id !== itemId
            ? item
            : { ...item, status: ITEM_STATUS.ACTIVE }
        )
      }
    );
  }

  function softDeleteItem(state, {listId, itemId}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
        ...list,
        items: list.items.map(item =>
          item.id !== itemId
          ? item
          : {
            ...item,
            status: ITEM_STATUS.REMOVED,
            removedAt: Date.now()
          }
        )
      }
    );
  }

  function editItem(state, {listId, itemId, name}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
          ...list,
          items: list.items.map(item =>
            item.id !== itemId
              ? item
              : {
                  ...item,
                  name: name
                }
          )
        }
    );
  }

  function archiveItems(state, {}) {
    return state.map(list => (
      {
        ...list,
        items: list.items.map(item => {
          if (
            item.status === ITEM_STATUS.DONE &&
            item.completedAt &&
            Date.now() - item.completedAt > SEVEN_DAYS
          ) {
            return {
              ...item,
              status: ITEM_STATUS.ARCHIVED,
              archivedAt: Date.now()
            };
          }
          return item;
        })
      }
    ));
  }

  function hardDeleteItem(state, {listId, itemId}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
        ...list,
        items: list.items.filter(
          item => item.id !== itemId)
      })
  }

  function hardDeleteItems(state, {}) {
    return state.map(list => ({
      ...list,
      items: list.items.filter(item =>
        !(
          item.status === ITEM_STATUS.REMOVED &&
          item.removedAt &&
          Date.now() - item.removedAt > 30 * DAY
        )
      )
    }));
  }

  function listsReducer(state, action) {
    switch(action.type) {
      case "toggleItem": {
        return toggleItem(state, action);
      }
      case "addItem": {
        return addItem(state, action); 
      }
      case "softDeleteItem": {
        return softDeleteItem(state, action);        
      }
      case "editItem": {
        return editItem(state, action);
      }
      case "restoreItem": {
        return restoreItem(state, action);
      }
      case "archiveItems": {
        return archiveItems(state, action);
      }
      case "hardDeleteItems": {
        return hardDeleteItems(state, action);
      }
      case "hardDeleteItem": {
        return hardDeleteItem(state, action);
      }
      default: 
        return state;
    }
  }

  function historyReducer(state, action) {
    const { past, present, future } = state;
    
    switch(action.type) {
      case "undo": {
        if (past.length === 0) {
          return state;
        }
        return {
          past: [...past.slice(0, past.length - 1)],
          present: past[past.length - 1],
          future: [present, ...future]
        }
      }
      case "redo": {
        if (future.length === 0) {
          return state;
        }
        return {
          past: [...past, present],
          present: future[0],
          future: [...future.slice(1, future.length)]
        }
      }
      default:
        return {
          past: [...past, present],
          present: listsReducer(present, action),
          future: []
        }
    }
  }

  useKeyboardShortcut(
    { key: "z", ctrl: true },
    () => historyDispatch({ type: "undo" })
  );

  useKeyboardShortcut(
    { key: "z", ctrl: true, shift: true },
    () => historyDispatch({ type: "redo" })
  );

  const { present } = history;
  
  useEffect(() => {
    const interval = setInterval(() => {
      historyDispatch({type: "hardDeleteItems"});
      historyDispatch({type: "archiveItems"});
    }, 60_000)
    return () => clearInterval(interval);
  }, [present, historyDispatch]);

  return <ListsContext.Provider value={{
    present,
    historyDispatch,
    editingItem,
    setEditingItem,
  }}>
    <ListCollabSpace />
  </ListsContext.Provider>;
}