// src/index.js
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import "antd/dist/reset.css" 
import { BrowserRouter as Router } from "react-router-dom"
import { TaskProvider } from "./context/TaskContext" 

const container = document.getElementById("root")
const root = ReactDOM.createRoot(container) 

root.render(
  <React.StrictMode>
    <TaskProvider>
      {" "}
      {/* Wrap App with TaskProvider */}
      <Router>
        <App />
      </Router>
    </TaskProvider>
  </React.StrictMode>
)
