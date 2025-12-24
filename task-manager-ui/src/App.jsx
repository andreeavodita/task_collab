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
  
  //   {title: "Groceries", items: [ITEMS[0], ITEMS[1], ITEMS[2]]},
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
          onChange={() => onToggle(item.id)}
        />
        <span>
          {item.name}
        </span>
      </label>
    </div>
  )
}

function List({ items }) {
  function toggleItem(id) {

  }

  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.name} 
          item={item} 
          onToggle={toggleItem}
        />
      ))}  
    </ul>
  );
}

function ListTitle({title}) {
  return <h2 className='list-title'>{title}</h2>
}

function TitledList({list}) {
  return (
    <div className='list-card'>
      <ListTitle title={list.title}/>
      <div className='list-divider'/>
      <List items={list.items}/>
    </div>
  )
}

function ListCollabSpace({lists}) {
  return (
    <div className="lists-grid">
      {lists.map(list => (
        <TitledList key={list.id} list={list} />
      ))}
    </div>
  )
}

export default function App() {
  return <ListCollabSpace lists={LISTS} />;
}