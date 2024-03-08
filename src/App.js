import React, { useState, useEffect } from 'react';
import './App.css';

// import { useTransition, animated } from 'react-spring';
// import { Flipper, Flipped } from'react-flip-toolkit';

function App() {
  // const appStyle = {
  //   height: '100vh',
  //   width: '100vw',
  //   backgroundImage: `url('${process.env.PUBLIC_URL}/background.jpg')`, // Assuming image is in the public folder
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  //   backgroundRepeat: 'repeat',
  // };

  // Import tasks from local storage
  const loadTodos = () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    // Example tasks if the local storage is empty
    return [
         {
      content: 'Example task 1',
      isCompleted: false,
    },
    {
      content: 'Example task 2',
      isCompleted: false,
    },
    {
      content: 'Done Example task',
      isCompleted: true,
    }
 
    ];
  }

  const [todos, setTodos] = useState(loadTodos());

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Automatically add an empty todo at the start of the list if all tasks are completed or the list is cleared
  useEffect(() => {
    if (todos.every(todo => todo.isCompleted) || todos.length === 0) {
      setTodos([
        {
          content: '',
          isCompleted: false,
        },
     ...todos,
      ]);
    }
  })

  function handleKeyDown(e, i) {
    if (e.key === 'Enter') {
      createTodoAtIndex(e, i);
    }
    if (e.key === 'Backspace' && todos[i].content === '') {
      e.preventDefault();
      return removeTodoAtIndex(i);
    }
    // Navigate up the list
    if (e.key === 'ArrowUp') {
      if (i === 0) return;
      document.forms[0].elements[i - 1].focus();
    }
    // Navigate down the list
    if (e.key === 'ArrowDown') {
      if (i === todos.length - 1) return;
      document.forms[0].elements[i + 1].focus();
    } 
  }



  function createTodoAtIndex(e, i) {
    const newTodos = [...todos];
    newTodos.splice(i + 1, 0, {
      content: '',
      isCompleted: false,
    });
    setTodos(newTodos);
    setTimeout(() => {
      document.forms[0].elements[i + 1].focus();
    }, 0);
  }

  function updateTodoAtIndex(e, i) {
    const newTodos = [...todos];
    newTodos[i].content = e.target.value;
    setTodos(newTodos);
  }

  function removeTodoAtIndex(i) {
    if (i === 0 && todos.length === 1) return;
    setTodos(todos => todos.slice(0, i).concat(todos.slice(i + 1, todos.length)));
    setTimeout(() => {
      document.forms[0].elements[i - 1].focus();
    }, 0);
  }

  function toggleTodoCompleteAtIndex(index) {
    const temporaryTodos = [...todos];
    // Toggle the isCompleted property
    temporaryTodos[index].isCompleted = !temporaryTodos[index].isCompleted;

    // If the todo is now completed, move it to the end of the list
    if (temporaryTodos[index].isCompleted) {
      const completedTodo = temporaryTodos.splice(index, 1)[0];
      temporaryTodos.push(completedTodo);
    }
    setTodos(temporaryTodos);
  }


  return (
    <div className="app">
      <div className="header">
        <h1>Must (To) Do Today!</h1>
      <p>Press: <strong>Enter</strong> to Add, <strong>Backspace</strong> to Remove and <strong>Arrow keys</strong> to navigate between items.</p>    
      </div>
      <form className="todo-list">
        <ul>
          {todos.map((todo, i) => (
            <div className={`todo ${todo.isCompleted && 'todo-is-completed'}`}>
              <div className={'checkbox'} onClick={() => toggleTodoCompleteAtIndex(i)}>
                {todo.isCompleted && (
                  <span>&#x2714;</span>
                )}
              </div>
              <input
                type="text"
                value={todo.content}
                onKeyDown={e => handleKeyDown(e, i)}
                onChange={e => updateTodoAtIndex(e, i)}
              />
            </div>
          ))}
        </ul>
        <div className="clearDone">
          {/* Button for the completed tasks */}
          <button type="button" className='btn' 
            onClick={() => setTodos(todos.filter(todo =>!todo.isCompleted))}>Clear Completed
          </button>
        </div>
      </form>
      <div className="footer">
        <p>Created by <a href='https://arttu.info'>Arttu Heinilä</a></p>
      </div>
    </div>
  );
}

export default App;
