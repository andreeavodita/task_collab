import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
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

function DeleteButton({ removeItem, itemId, listId}) {
  return <button className='deleteitembutton'
                 onClick={() => removeItem(listId, itemId)}>
                 <img src={trash} alt="Trash" />
                 </button>
}

function ListItem({item, listId, onToggle, removeItem, editItem, editingItem, setEditingItem }) {
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
                        editItem(listId, item.id, draftName);
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
        removeItem={removeItem} 
        itemId={item.id} 
        listId={listId}
      />
    </li>
  )
}

function List({ listId, items, onToggle, removeItem, editItem, editingItem, setEditingItem }) {

  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          listId={listId}
          onToggle={() => onToggle(listId, item.id)}
          removeItem={removeItem}
          editItem={editItem}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
      ))}  
    </ul>
  );
}

function ListTitle({title}) {
  return <h2 className='list-title'>{title}</h2>
}

function TitledList({list, onToggle, addItem, removeItem, editItem, editingItem, setEditingItem }) {
  return (
    <div className='list-card'>
      <ListTitle title={list.title}/>
      <div className='list-divider'/>
      <List 
          listId={list.id} 
          items={list.items} 
          onToggle={onToggle}
          removeItem={removeItem}
          editItem={editItem}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          />
      <input
          type="checkbox"
          checked={false}
          onChange={onToggle}
      />
      <input
        type="text"
        onKeyDown={
          (e) => {
            if (e.key === "Enter") {
              addItem(list.id, e.target.value);
              e.target.value = "";
            }
          }
        }
      />
    </div>
  )
}

function ListCollabSpace({lists, onToggle, addItem, removeItem, editItem, editingItem, setEditingItem }) {
  return (
    <div className="lists-grid">
      {lists.map(list => (
        <TitledList 
            key={list.id} 
            list={list} 
            onToggle={onToggle} 
            addItem={addItem}
            removeItem={removeItem}    
            editItem={editItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [lists, setLists] = useState(LISTS);
  const [editingItem, setEditingItem] = useState(null);

  function toggleItem(listId, itemId) {
    setLists(prevLists =>
      prevLists.map(list =>
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
    );
  }

  function addItem(listId, name) {
    setLists(prevLists =>
      prevLists.map(list =>
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
    );
  }

  function removeItem(listId, itemId) {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id !== listId
          ? list
          : {
            ...list,
            items: list.items.filter(
              item => item.id !== itemId)
          }
      )
    );
  }

  function editItem(listId, itemId, name) {
    setLists(prevLists =>
      prevLists.map(list =>
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
    );
  }

  return <ListCollabSpace 
            lists={lists} 
            onToggle={toggleItem} 
            addItem={addItem} 
            removeItem={removeItem}
            editItem={editItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />;
}