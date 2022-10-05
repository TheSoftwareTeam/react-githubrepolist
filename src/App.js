import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import ToDo from "./components/ToDo/ToDo";
import ToDoDetail from "./components/ToDo/ToDoDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/todo" element={<ToDo/>}/>
        <Route exact path="/tododetail" element={<ToDoDetail/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
