import { createContext, useContext, useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'
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

function DeleteButton({ listsDispatch, itemId, listId}) {
  return <button className='deleteitembutton'
                 onClick={() => listsDispatch({type: "removeItem", listId: listId, itemId: itemId})}>
                 <img src={trash} alt="Trash" />
                 </button>
}

function ListItem({item, listId, onToggle }) {

  const {
    listsDispatch,
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
                        listsDispatch({type: "editItem", listId: listId, itemId: item.id, name: draftName});
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
        listsDispatch={listsDispatch} 
        itemId={item.id} 
        listId={listId}
      />
    </li>
  )
}

function List({ listId, items }) {

  const { listsDispatch } = useContext(ListsContext);

  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          listId={listId}
          onToggle={() => listsDispatch({type: "toggleItem", listId: listId, itemId: item.id})}
        />
      ))}  
    </ul>
  );
}

function ListTitle({title}) {
  return <h2 className='list-title'>{title}</h2>
}

function TitledList({ list }) {

  const { listsDispatch } = useContext(ListsContext);

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
              listsDispatch({type: "addItem", listId: list.id, name: e.target.value});
              e.target.value = "";
            }
          }
        }
      />
    </div>
  )
}

function ListCollabSpace({ }) {

  const { lists } = useContext(ListsContext)

  return (
    <div className="lists-grid">
      {lists.map(list => (
        <TitledList 
            key={list.id} 
            list={list}
        />
      ))}
    </div>
  )
}

const ListsContext = createContext(null);

export default function App() {
  const [lists, listsDispatch] = useReducer(listsReducer, LISTS);
  const [editingItem, setEditingItem] = useState(null);

  function listsReducer(state, action) {
    switch(action.type) {
      case "toggleItem": {
        const {listId, itemId} = action;
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
        )
      }
      case "addItem": {
        const {listId, name} = action;
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
        )
      }
      case "removeItem": {
        const {listId, itemId} = action;
        return state.map(list =>
          list.id !== listId
          ? list
          : {
            ...list,
            items: list.items.filter(
              item => item.id !== itemId)
          }
        )
      }
      case "editItem": {
        const {listId, itemId, name} = action;
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
        )
      }
      default: 
        return state;
    }
  }

  return <ListsContext.Provider value={{
    lists,
    listsDispatch,
    editingItem,
    setEditingItem,
  }}>
    <ListCollabSpace />
  </ListsContext.Provider>;
}