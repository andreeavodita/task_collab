import { useState } from 'react'

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
                  'X'
                 </button>
}

function ListItem({item, listId, onToggle, removeItem}) {
  const isChecked = item.status === "DONE";

  return (
    <div className={isChecked ? "done" : ""}>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
        />
        <span>
          {item.name}
        </span>
        <DeleteButton removeItem={removeItem} itemId={item.id} listId={listId}/>
      </label>
    </div>
  )
}

function List({ listId, items, onToggle, removeItem }) {

  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          listId={listId}
          onToggle={() => onToggle(listId, item.id)}
          removeItem={removeItem}
        />
      ))}  
    </ul>
  );
}

function ListTitle({title}) {
  return <h2 className='list-title'>{title}</h2>
}

function TitledList({list, onToggle, addItem, removeItem }) {
  return (
    <div className='list-card'>
      <ListTitle title={list.title}/>
      <div className='list-divider'/>
      <List 
          listId={list.id} 
          items={list.items} 
          onToggle={onToggle}
          removeItem={removeItem}/>
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

function ListCollabSpace({lists, onToggle, addItem, removeItem }) {
  return (
    <div className="lists-grid">
      {lists.map(list => (
        <TitledList 
            key={list.id} 
            list={list} 
            onToggle={onToggle} 
            addItem={addItem}
            removeItem={removeItem}    
        />
      ))}
    </div>
  )
}

export default function App() {
  const [lists, setLists] = useState(LISTS);

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
                id: list.items[list.items.length - 1].id + 1,
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
            items: list.items.map(item =>
              item.id !== itemId
                ? item
                : null
            ).filter(item => item !== null)
          }
      )
    );
  }

  return <ListCollabSpace 
            lists={lists} 
            onToggle={toggleItem} 
            addItem={addItem} 
            removeItem={removeItem}
          />;
}