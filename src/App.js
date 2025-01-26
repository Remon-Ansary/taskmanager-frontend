// src/App.js
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Layout, Menu } from "antd"
import {
  UnorderedListOutlined,
  FormOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import TaskDetails from "./components/TaskDetails"
import OverdueTask from "./components/OverdueTask"

const { Header, Content, Footer, Sider } = Layout

const App = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Main Content */}
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          <h1>Task Manager</h1>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/new" element={<TaskForm />} />
              <Route path="/tasks/:id/edit" element={<TaskForm />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/tasks/overdue" element={<OverdueTask />} />
              <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Task Manager ©2025 Agrigate
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
