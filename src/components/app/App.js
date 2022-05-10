import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import Draggable from "react-draggable";
import randomColor from "randomcolor";
import Modal from "../modal/Modal.js";
import './App.css';


function App() {

  const [modalActive, setModalActive] = useState(false)
  const [item, setItem] = useState('')
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  )

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])


  const newItem = () => {
    if (item.trim() !== '') {
      const newItem = {
        id: uuidv4(),
        item,
        color: randomColor({
          luminosity: 'light'
        }),
        defaultPos: {
          x: Math.random() * 500,
          y: -500
        }
      }
      setItems((items) => [...items, newItem])
      setItem('')
    } else {
      alert('Enter something')
      setItem('')
    }
  }

  const deleteNode = (id) => {

    /*   setItems(items.filter((item) => item.id !== id)) */
    const idx = items.findIndex((item) => item.id === id);
    const newArray = [...items.slice(0, idx), ...items.slice(idx + 1)];
    setItems(newArray)
  }
  const updatePos = (data, index) => {

    let newArray = [...items]
    newArray[index].defaultPos = { x: data.x, y: data.y }
    setItems(newArray)

  }
  const KeyPress = (e) => {

    const code = e.keyCode || e.which
    if (code === 13) {
      newItem()

    }
  }
  const deleteAll = () => {
    setItems([])
    setModalActive(false)
  }


  return (
    <div className="App">
      <div className="wrapper">
        <input
          value={item}
          type='text'
          placeholder="Enter something"
          onKeyPress={(e) => KeyPress(e)}
          onChange={(e) => setItem(e.target.value)}
        ></input>

        <button
          className="enter"
          onClick={newItem}
        >Enter</button>
        <button
          className="enter"
          onClick={() => setModalActive(true)}
        >
          Delete all
        </button>

      </div>
      {
        items.map((item, index) => {
          return (
            <Draggable
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
      <Modal active={modalActive} setActive={setModalActive}>
        <h2>Are you sure you want to delete all notes?</h2>
        <button className="enter mt-3" onClick={deleteAll}>Yes</button>
        <button className="enter mt-3" onClick={() => setModalActive(false)}>No</button>
      </Modal>
    </div>
  );
}

export default App;
