import React, { useState } from "react";
import "./App.css";
// Components
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
// Todo Model/Interface
import { Todo } from "./models/models";
// Drag/Drop
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const App: React.FC = () => { // React.FC --> Functional Component
  const [todo, setTodo] = useState<string>(""); // Todo is a string
  const [todos, setTodos] = useState<Array<Todo>>([]); // Todos is an array of Todos (based off model/interface of todo)
  const [CompletedTodos, setCompletedTodos] = useState<Array<Todo>>([]); // CompletedTodos is an array of Todos

  // Add a task
  const handleAdd = (e: React.FormEvent) => { // The event is a React.FormEvent
    e.preventDefault();

    if (todo) { // If there is something being submitted
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]); // set todos with all the current todos + the new todo (id, text, isDone set to false)
      setTodo(""); // clear input
    }
  };

  // Drag and Drop Functionality
  const onDragEnd = (result: DropResult) => { // takes in DropResult object
    const { destination, source } = result; // take out destination (where its going) and source (where its coming from)

    if (!destination) { return; } // If there is no destination, do nothing

    if (destination.droppableId === source.droppableId && destination.index === source.index) { return; } // If its put in the same place, do nothing

    let add;
    let active = todos;
    let complete = CompletedTodos;
    // Source Logic --> Moving from Todo
    if (source.droppableId === "TodosList") { // If youre taking from Todo List
      add = active[source.index]; // Set that todo to move
      active.splice(source.index, 1); // and splice the todos array at that index
    } else { // If youre taking from the Completed List
      add = complete[source.index]; // Set that todo to move
      complete.splice(source.index, 1); // and splice the completed todos array at that index
    }

    // Destination Logic --> Moving from Completed
    if (destination.droppableId === "TodosList") { // // If youre taking from Completed List
      active.splice(destination.index, 0, add); //
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete); // add dragged todo to CompletedTodos
    setTodos(active); // add dragged todo to regular todos array
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Taskify</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          CompletedTodos={CompletedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
