/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useEffect, useState, useCallback } from "react";
import "./ToDo.css";
import { Card, Col } from "reactstrap";

import { supabase } from "../Client/client";
import { TiDeleteOutline } from "react-icons/ti";

export default function ToDo() {
  const [eldekiId, setEldekiId] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isToggled, setIsToggled] = useState(true);

  const toggle = useCallback(
    () => setIsToggled(!isToggled),
    [isToggled, setIsToggled],
    console.log(isToggled)
  );

  function eldeki(eldeki) {
    setEldekiId(eldeki);
  }

  const selectTodos = async () => {
    let { data } = await supabase
      .from("todo_task")
      .select("*")
      .order("task_id", { ascending: false });
    setTodos(data);
    console.log(data);
  };

  useEffect(() => {
    selectTodos();

    setEldekiId(eldeki);
  }, []);
  let data = [];
  var index = 1;
  return (
    <Col sm="7">
      {isToggled ? (
        //ToDo
        <Card body className="card1">
          <div className="Todo-card">
            <nav></nav>
            <h2>My Todo List</h2>
            <div className="List-view ">
              {todos &&
                todos
                  .slice()
                  .reverse()
                  .map((todoItem) => (
                    <div
                      key={todoItem.task_id}
                      className="List-tile App-border-radius"
                    >
                      {index++}
                      {"."}
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
                        value={todoItem.task + " "}
                        onChange={(e) => {
                          const { value } = e.target;
                          setTodos(value);
                        }}
                      />

                      <a
                        className="details"
                        onClick={() => {
                          eldeki(todoItem.task_id);
                          toggle();
                        }}
                      >
                        Details
                      </a>
                    </div>
                  ))}
            </div>
            <AddTodo setTodos={selectTodos} />
          </div>
        </Card>
      ) : (
        //ToDoDetail
        <Card body className="card2">
          <div className="Todo-card">
            <h2>Todo Details</h2>

            <button onClick={toggle}>Go Back</button>

            <Tododetail gettask_id={eldekiId} />
          </div>
        </Card>
      )}
    </Col>
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
        task_id="text"
        className="Input-field App-border-radius"
        placeholder="Task Description"
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        task_id="btn"
        type="submit"
        onClick={onSubmit}
        className="App-button Add-button App-border-radius"
      >
        Add
      </button>
    </form>
  );
};

const Tododetail = ({ gettask_id }) => {
  const [todosdetail, setTodosdetail] = useState([]);

  const [completed, setCompleteddetail] = useState(
    todosdetail &&
      todosdetail
        .slice()
        .reverse()
        .map((todoItemdetail) => todoItemdetail.is_complete)
  ); //is_completed null dönüyor

  const selectTodosdetail = async () => {
    let { data } = await supabase
      .from("todo_subtask")
      .select("*")
      .eq("task_id", gettask_id)
      .order("subtask_id", { ascending: false });
    setTodosdetail(data);
  };
  useEffect(() => {
    selectTodosdetail();
  }, []);

  const onCompleteTodo = (subtask_id) => {
    supabase
      .from("todo_subtask")
      .update({ is_complete: !completed })
      .match({ subtask_id })
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setCompleteddetail((prev) => !prev);
        }
        console.log(data);
      });
  };

  const onDeleteTodo = async (subtask_id) => {
    const { error } = await supabase
      .from("todo_subtask")
      .delete()
      .match(
        {subtask_id}
      );
    if (!error) {
      setTodosdetail((prev) => {
        return prev.filter((todoItem) => {
          return (
            todoItem.subtask_id !== subtask_id
          );
        });
      });
    }
  };
  var index = 1;
  return (
    <div className="List-view">
      {todosdetail &&
        todosdetail
          .slice()
          .reverse()
          .map((todoItemdetail) => (
            <div
              key={todoItemdetail.subtask_id}
              className="List-tile App-border-radius"
            >
              {index++}
              {"."}
              <input
                checked={completed}
                className="List-tile-leading"
                type="checkbox"
                onChange={(e) => {
                  onCompleteTodo(todoItemdetail.subtask_id);
                  e.preventDefault();

                  console.log(completed);
                }}
              />

              {/* {todosdetail.length} */}

              <input
                style={{
                  width: "100%",
                  height: "1.75rem",
                  fontSize: "1.5rem",
                  background: "transparent",
                  border: "0.02rem solid black",
                  borderRadius: 8,
                  paddingLeft: 8,
                  textDecorationLine: "line",
                }}
                value={todoItemdetail.subtask}
                onChange={(e) => {
                  const { value } = e.target;
                  setTodosdetail(value);
                }}
              />

              <TiDeleteOutline
                className="List-tile-trailing"
                onClick={() => {
                  onDeleteTodo(todoItemdetail.subtask_id);
                }}
              />
            </div>
          ))}
      <AddTododetail
        setTodosdetail={selectTodosdetail}
        gettask_id={gettask_id}
      />
    </div>
  );
};
const AddTododetail = ({ setTodosdetail, gettask_id }) => {
  //const task_id = props.task_id;
  const [subtask, setTask] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
    if (subtask === "") return;
    supabase
      .from("todo_subtask")
      .insert({
        subtask: subtask,
        user_id: supabase.auth.user().id,
        task_id: gettask_id,
      })
      .single()
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setTodosdetail((prevTodos) => [data, ...prevTodos]);
          //Sorunlu düzeltilecek (Aynı listeyi üstüne yazdırıyor.)
        }
      });
    console.log(subtask);
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
