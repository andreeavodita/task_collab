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

function ListItem({item, onToggle}) {
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
      </label>
    </div>
  )
}

function List({ listId, items, onToggle }) {

  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.name} 
          item={item} 
          onToggle={() => onToggle(listId, item.id)}
        />
      ))}  
    </ul>
  );
}

function ListTitle({title}) {
  return <h2 className='list-title'>{title}</h2>
}

function TitledList({list, onToggle}) {
  return (
    <div className='list-card'>
      <ListTitle title={list.title}/>
      <div className='list-divider'/>
      <List listId={list.id} items={list.items} onToggle={onToggle}/>
    </div>
  )
}

function ListCollabSpace({lists, onToggle}) {
  return (
    <div className="lists-grid">
      {lists.map(list => (
        <TitledList key={list.id} list={list} onToggle={onToggle}/>
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
            )
          }
      )
    );
  }

  return <ListCollabSpace lists={lists} onToggle={toggleItem}/>;
}