import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter basename="/Judgify">
      <Routes>
        <Route path="/" element={<Login onLogin={() => {}} />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
