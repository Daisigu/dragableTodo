import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import Draggable from "react-draggable";
import randomColor from "randomcolor";
import Modal from "../modal/Modal.js";
import './App.css';


function App() {

  const [deleteModalActive, setDeleteModalActive] = useState(false) //State of Delete modal
  const [enterModalActive, setEnterModalActive] = useState(false) // State of Enter Modal
  const [item, setItem] = useState('') 
  const [items, setItems] = useState( 
    JSON.parse(localStorage.getItem('items')) || []
  )

  useEffect(() => {    
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

  const newItem = () => {   //Create new item
    if (item.trim() !== '') {
      const newItem = {
        id: uuidv4(),
        item,
        color: randomColor({
          luminosity: 'light'
        }),
        defaultPos: {
          x: Math.random() * 750,
          y: getRandomInt(-363, -580)
        }
      }
      setItems((items) => [...items, newItem])
      setItem('')
    } else {
      setEnterModalActive(true)
      setItem('')
    }
  }





  const deleteNode = (id) => { //Delete one Note 

    const idx = items.findIndex((item) => item.id === id);
    const newArray = [...items.slice(0, idx), ...items.slice(idx + 1)];
    setItems(newArray)
  }
  const updatePos = (data, index) => { //Update Position logic

    let newArray = [...items]
    newArray[index].defaultPos = { x: data.x, y: data.y }
    setItems(newArray)

  }
  const KeyPress = (e) => { //Press Enter logic

    const code = e.keyCode || e.which
    if (code === 13) {
      newItem()

    }
  }
  const deleteAll = () => { //delete all notes function
    setItems([])
    setDeleteModalActive(false)
  }

  function EmptyNotes(items) { //Delete modal logic

    if (items.items.length === 0) {
      return (
        <React.Fragment>
          <h1>There are no notes to delete</h1>
          <button className="button mt-3" onClick={() => setDeleteModalActive(false)}>Ok</button>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <h2>Are you sure you want to delete all notes?</h2>
        <button className="button mt-3" onClick={deleteAll}>Yes</button>
        <button className="button mt-3" onClick={() => setDeleteModalActive(false)}>No</button>
      </React.Fragment>
    )


  }


  return (
    <div className="App">
      <div className="wrapper">
        <input
          value={item}
          maxlength="250"
          type='text'
          placeholder="Enter something"
          onKeyPress={(e) => KeyPress(e)}
          onChange={(e) => setItem(e.target.value)}
        ></input>

        <button
          className="button"
          onClick={newItem}
        >Enter</button>
        <button
          className="button"
          onClick={() => setDeleteModalActive(true)}
        >
          Delete all
        </button>

      </div>
      {
        items.map((item, index) => {
          return (
            <Draggable
              bounds={"parent"}
              onStop={(_, data) => {
                updatePos(data, index)
              }}
              key={index}
              defaultPosition={item.defaultPos}
              position={item.defaultPos}
            >
              <div className="todo-item" style={{ backgroundColor: item.color }}>
                {`${item.item}`}
                <button
                  className="delete"
                  onClick={() => deleteNode(item.id)}
                >x</button>
              </div>
            </Draggable>
          )
        })
      }
      <Modal active={deleteModalActive} setActive={setDeleteModalActive}>
        <EmptyNotes items={items} />
      </Modal>
      <Modal active={enterModalActive} setActive={setEnterModalActive}>
        <h1>You have to enter something</h1>
        <button className="button mt-3" onClick={() => setEnterModalActive(false)}>Ok</button>
      </Modal>

    </div>
  );
}

export default App;


