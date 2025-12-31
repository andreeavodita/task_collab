import { createContext, useContext, useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'
import useKeyboardShortcut from './keyboard-shortcut.jsx'
import trash from './assets/trashcan.svg';

const ITEMS = [
  {id: 1, name: "Milk", status: "ACTIVE"},
  {id: 2, name: "Bread", status: "DONE"},
  {id: 3, name: "Pumpkin", status: "ACTIVE"},
  {id: 4, name: "Clean the kitchen", status: "ACTIVE"},
  {id: 5, name: "Wash clothes", status: "DONE"}
]

const LISTS = [
  {id: 1, title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
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

function DeleteButton({ historyDispatch, itemId, listId}) {
  return <button className='deleteitembutton'
                 onClick={() => historyDispatch({type: "removeItem", listId: listId, itemId: itemId})}>
                 <img src={trash} alt="Trash" />
                 </button>
}

function ListItem({item, listId, onToggle }) {

  const {
    historyDispatch,
    editingItem,
    setEditingItem
  } = useContext(ListsContext);

  const isChecked = item.status === "DONE";
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
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
      />

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

      <DeleteButton 
        historyDispatch={historyDispatch} 
        itemId={item.id} 
        listId={listId}
      />
    </li>
  )
}

function List({ listId, items }) {

  const { historyDispatch } = useContext(ListsContext);

  return (
    <ul>
      {items.map(item => (
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
            status: item.status === "DONE" ? "ACTIVE" : "DONE"
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
            status: "ACTIVE"
          }
        ]
      }
    );
  }

  function removeItem(state, {listId, itemId}) {
    return state.map(list =>
      list.id !== listId
      ? list
      : {
        ...list,
        items: list.items.filter(
          item => item.id !== itemId)
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

  function listsReducer(state, action) {
    switch(action.type) {
      case "toggleItem": {
        return toggleItem(state, action);
      }
      case "addItem": {
        return addItem(state, action); 
      }
      case "removeItem": {
        return removeItem(state, action);        
      }
      case "editItem": {
        return editItem(state, action);
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

  return <ListsContext.Provider value={{
    present,
    historyDispatch,
    editingItem,
    setEditingItem,
  }}>
    <ListCollabSpace />
  </ListsContext.Provider>;
}