import React from "react";
import { useEffect, useState } from "react";
import "./ToDo.css";
import { supabase } from "../Client/client";
import { TiDeleteOutline } from "react-icons/ti";


export default function ToDoDetail(props) {
  const task_id = props.task_id;



  const [todos, setTodos] = useState([]);

  const selectTodos = async () => { 
    console.log(task_id);
    let { data } = await supabase
      .from("todo_subtask")
      .select("*")
      //.eq("task_id",task_id)
      .order("subtask_id", { ascending: false });
    setTodos(data);
  };

  useEffect(() => {
   
    console.log(task_id);
    selectTodos();

  }, []);

  return ( 
    <div className="Todo-card"> 
      <nav></nav> 
      <h2>Todo Details</h2>
      <button onClick={selectTodos}>Tıkla</button>
      <div className="List-view">
        {todos &&
          todos.map((todoItem) => (
            <Todo key={todoItem.subtask_id} {...todoItem} setTodos={setTodos} task_id={todoItem.task_id}/>
          ))}
      </div>
      <AddTodo setTodos={selectTodos} task_id={task_id}/>
    </div>
  );
}
const AddTodo = ({ setTodos }, props) => {
  const task_id = props.task_id;
  const [subtask, setTask] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
    if (subtask === "") return;
    supabase
      .from("todo_subtask")
      .insert({ subtask: subtask, user_id: supabase.auth.user().id, task_id:{task_id} })
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
        subtask_id="text"
        className="Input-field App-border-radius"
        placeholder="Sub Task Description"
        type="text"
        value={subtask}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        subtask_id="btn"
        type="submit"
        onClick={onSubmit}
        className="App-button Add-button App-border-radius"

      >
        Add
      </button>
    </form>
    
  );
};

const Todo = ({ subtask_id, is_completed, subtask: subtask, setTodos ,task_id}) => {
  const [todo, setTodo] = useState(subtask);
  const [completed, setCompleted] = useState(is_completed);

  const onEditTodo = (subtask_id) => {
    if (todo === "") return;
    supabase
      .from("todo_subtask")
      .select("*")
      .eq("task_id",{task_id})
      .update({ subtask: todo })
      .match({ subtask_id })
      .then((value, error) => {
        console.log(value, error);
      });
  };

  const onCompleteTodo = (subtask_id) => {
    supabase
      .from("todo_subtask")
      .select("*")
      .eq("task_id",{task_id})
      .update({ is_completed: !completed })
      .match({ subtask_id })
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setCompleted((prev) => !prev);
        }
      });
  };

  const onDeleteTodo = async () => {
    const { error } = await supabase.from("todo_subtask").delete().match({ subtask_id });
    if (!error) {
      setTodos((prev) => {
        return prev.filter((todoItem) => {
          return todoItem.subtask_id !== subtask_id;
        });
      });
    }
  };

  return (
    <div key={subtask_id} className="List-tile App-border-radius">
      <input
        checked={completed}
        className="List-tile-leading"
        type="checkbox"
        onChange={(e) => {
          e.preventDefault();
          onCompleteTodo(subtask_id);
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
      {subtask !== todo && (
        <button
          onClick={() => onEditTodo(subtask_id, todo)}
          className="Todo-update-submit"
        >
          save
        </button>
      )}
      {subtask !== todo && <button onClick={() => onEditTodo(subtask_id, todo)} className="Todo-update-submit">save</button>}
    <TiDeleteOutline className="List-tile-trailing" onClick={onDeleteTodo} />
    </div>
  );
};
