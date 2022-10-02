import React from "react";
import { useEffect, useState } from "react";
import "./RepoDetail.css";
import { Button, Card, ListGroup, ListGroupItem } from "reactstrap";
import { FcTodoList } from "react-icons/fc";
import { supabase } from "../Client/client";
import { TiDeleteOutline } from "react-icons/ti";
export default function RepoDetail() {
  const [count] = useState(0);
  const [todos, setTodos] = useState([]);

  const selectTodos = async () => {
    let { data } = await supabase
      .from("todo_task")
      .select("*")
      .order("id", { ascending: false });
    setTodos(data);
  };

  useEffect(() => {
    selectTodos();
  }, []);

  return (
    <div className="Todo-card">
      <nav></nav>

      <AddTodo setTodos={selectTodos} />
      <div className="List-view">
        {todos &&
          todos.map((todoItem) => (
            <Todo key={todoItem.id} {...todoItem} setTodos={setTodos} />
          ))}
      </div>
    </div>
  );
}
const AddTodo = ({ setTodos }) => {
  const [task, setTask] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
    if (task === "") return;
    supabase
      .from("todo_task")
      .insert({ task: task, user_id: supabase.auth.user().id })
      .single()
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setTodos((prevTodos) => [data, ...prevTodos]);
        }
      });
  };


  // const btn = document.getElementById("btn");
  // btn.addEventListener("click", function handleClick(event) {
  //   event.preventDefault();
  //   const text = document.getElementById("text");
  //   console.log(text.value);
  //   text.value = "";
  // });
  return (
    <form className="Input-container">
      <input
        id="text"
        className="Input-field App-border-radius"
        placeholder="Add task"
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        id="btn"
        type="submit"
        onClick={onSubmit}
        className="App-button Add-button App-border-radius"

      >
        Add
      </button>
    </form>
    
  );
};

const Todo = ({ id, is_completed, task: task, setTodos }) => {
  const [todo, setTodo] = useState(task);
  const [completed, setCompleted] = useState(is_completed);

  const onEditTodo = (id) => {
    if (todo === "") return;
    supabase
      .from("todo_task")
      .update({ task: todo })
      .match({ id })
      .then((value, error) => {
        console.log(value, error);
      });
  };

  const onCompleteTodo = (id) => {
    supabase
      .from("todo_task")
      .update({ is_completed: !completed })
      .match({ id })
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setCompleted((prev) => !prev);
        }
      });
  };

  const onDeleteTodo = async () => {
    const { error } = await supabase.from("todo_task").delete().match({ id });
    if (!error) {
      setTodos((prev) => {
        return prev.filter((todoItem) => {
          return todoItem.id !== id;
        });
      });
    }
  };

  return (
    <div key={id} className="List-tile App-border-radius">
      <input
        checked={completed}
        className="List-tile-leading"
        type="checkbox"
        onChange={(e) => {
          e.preventDefault();
          onCompleteTodo(id);
        }}
      />
      <input
        style={{
          width: "100%",
          height: "1.75rem",
          fontSize: "1.5rem",
          background: "transparent",
          border: "0.02rem solid black",
          borderRadius: 8,
          paddingLeft: 8,
        }}
        value={todo}
        onChange={(e) => {
          const { value } = e.target;
          setTodo(value);
        }}
      />
      {task !== todo && (
        <button
          onClick={() => onEditTodo(id, todo)}
          className="Todo-update-submit"
        >
          save
        </button>
      )}
      <TiDeleteOutline className="List-tile-trailing" onClick={onDeleteTodo} />
    </div>
  );
};
