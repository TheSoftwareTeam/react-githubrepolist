/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useEffect, useState, useCallback } from "react";
import "./ToDo.css";
import { Card, Col } from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";
import { supabase } from "../Client/client";
import { TiDeleteOutline } from "react-icons/ti";

export default function ToDo() {

  const [eldekiId, setEldekiId] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isToggled, setIsToggled] = useState(true);


  const toggle = useCallback(
    () => setIsToggled(!isToggled),
    [isToggled, setIsToggled]
    //console.log(isToggled)
  );

  //todo detay sayfasına todo Id gönderme
  function eldeki(eldeki) {
    setEldekiId(eldeki);
  }

  //todo getirme
  const selectTodos = async () => {
    let { data } = await supabase
      .from("todo_task")
      .select("*")
      .order("task_id", { ascending: true });
    setTodos(data);
    console.log(data);

  };


  useEffect(() => {
    selectTodos();
    setEldekiId(eldeki);
    
  }, []);

  var index = 1;

  return (
    <Col sm="7">
      {/* Toggle ile (Todo ve Todo detay) sayfası arasında geçiş yapma */}
      {isToggled ? (
        //ToDo
        <Card body className="card1">
          <div className="Todo-card">
            <nav></nav>
            <h2>My Todo List</h2>
            <div className="List-view ">
              {todos &&
                todos.map((todoItem) => (
                  <div
                    key={todoItem.task_id}
                    className="List-tile App-border-radius"
                  >
                    {/* toplam todo sayısı */}
                    {index++}
                    {"."}

                    <input
                      style={{
                        width: "100%",
                        height: "2.1rem",
                        fontSize: "1.5rem",
                        background: "transparent",
                        border: "0.02rem solid black",
                        borderRadius: 8,
                        paddingLeft: 8,
                      }}
                      value={todoItem.task}
                      onChange={(e) => {
                        const { value } = e.target;
                        setTodos(value);

                      }}
                    />

                    {/* todo detay sayfası görüntüleme */}
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

            <button className="backBtn" onClick={toggle}>
              {" "}
              <FaArrowLeft />{" "}
            </button>

            <Tododetail gettask_id={eldekiId} />
          </div>
        </Card>
      )}
    </Col>
  );
}

//Todo Ekleme
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

//Subtask
const Tododetail = ({ gettask_id }) => {
  const [todosdetail, setTodosdetail] = useState([]);

  const [completed, setCompleteddetail] = useState(
    todosdetail &&
      todosdetail.map((todoItemdetail) => todoItemdetail.is_complete)
  ); //is_completed null dönüyor

  //Subtask getirme
  const selectTodosdetail = async () => {
    let { data } = await supabase
      .from("todo_subtask")
      .select("*")
      .eq("task_id", gettask_id)
      .order("subtask_id", { ascending: true });
    setTodosdetail(data);
  };
  useEffect(() => {
    selectTodosdetail();
  }, []);

  
  //Subtask Tamamlandı-Tamamlanmadı
  const onCompleteTodo = async (subtask_id) => {
    await supabase
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

  //Subtask Silme
  const onDeleteTodo = async (subtask_id) => {
    const { error } = await supabase
      .from("todo_subtask")
      .delete()
      .match({ subtask_id });
    if (!error) {
      setTodosdetail((prev) => {
        return prev.filter((todoItem) => {
          return todoItem.subtask_id !== subtask_id;
        });
      });
    }
  };
  var index = 1;
  return (
    <div className="List-view">
      {todosdetail &&
        todosdetail.map((todoItemdetail) =>
          todoItemdetail.is_complete ? (
            <div></div>
          ) : (
            // Tamamlanmayan todo detay
            <div
              key={todoItemdetail.subtask_id}
              className="List-tile App-border-radius"
            >
              {index++}
              {"."}
              <input
                checked={todoItemdetail.is_complete}
                className="List-tile-leading"
                type="checkbox"
                onChange={(e) => {
                  e.preventDefault();
                  onCompleteTodo(todoItemdetail.subtask_id);
                  selectTodosdetail();
                }}
              />

     

              <input
                style={{
                  width: "100%",
                  height: "2.1rem",
                  fontSize: "1.5rem",
                  background: "transparent",
                  border: "0.02rem solid black",
                  borderRadius: 8,
                  paddingLeft: 8,
                }}
                className={todoItemdetail.is_complete ? "line" : "noneLine"}
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
          )
        )}

      <hr></hr>

      {/* Tamamlanan Todo detay */}
      <h2>Completed Subtasks</h2>
      {todosdetail &&
        todosdetail.map((todoItemdetail) =>
          todoItemdetail.is_complete ? (
            <div
              key={todoItemdetail.subtask_id}
              className="List-tile App-border-radius"
            >
              <input
                checked={todoItemdetail.is_complete}
                className="List-tile-leading"
                type="checkbox"
                onChange={(e) => {
                  e.preventDefault();
                  onCompleteTodo(todoItemdetail.subtask_id);
                  selectTodosdetail();
                }}
              />

              <input
                style={{
                  width: "100%",
                  height: "2.1rem",
                  fontSize: "1.5rem",
                  background: "transparent",
                  border: "0.02rem solid black",
                  borderRadius: 8,
                  paddingLeft: 8,
                }}
                className={todoItemdetail.is_complete ? "line" : "noneLine"}
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
          ) : (
            <div></div>
          )
        )}
      <AddTododetail
        setTodosdetail={selectTodosdetail}
        gettask_id={gettask_id}
      />
    </div>
  );
};
//Subtask ekleme
const AddTododetail = ({ setTodosdetail, gettask_id }) => {
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
        }
      });
    console.log(subtask);
  };

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
