// src/components/TaskList.js
import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Table, Button, Select, Spin, message, Row, Col } from "antd"
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import "./TaskList.css"

const { Option } = Select

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      let url = "http://localhost:8000/api/tasks/"
      if (statusFilter) {
        url += `?status=${statusFilter}`
      }
      const response = await axios.get(url)
      setTasks(response.data.results || response.data)
      message.success("Tasks loaded successfully.")
    } catch (error) {
      console.error("Error fetching tasks:", error)
      message.error("Failed to fetch tasks.")
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const showDeleteConfirm = (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`
    )
    if (confirmed) {
      handleDelete(task.id)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`)
      message.success("Task deleted successfully.")
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
      message.error("Failed to delete task.")
    }
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (text, record) => (
        <a
          onClick={() => navigate(`/tasks/${record.id}`)}
          style={{ cursor: "pointer", color: "#1890ff" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      sorter: (a, b) => new Date(a.due_date) - new Date(b.due_date),
      render: (text) => new Date(text).toLocaleDateString(),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/tasks/${record.id}`)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            Delete
          </Button>
        </>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ]

  return (
    <div className="task-list-container">
      <h2 className="task-list-header">Task List</h2>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Filter by Status"
            style={{ width: "100%" }}
            allowClear
            onChange={(value) => setStatusFilter(value)}
            value={statusFilter || undefined}
          >
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Col>
        <Col xs={12} sm={12} md={12} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/tasks/new")}
            className="create-task-button"
            style={{ marginRight: 8 }}
          >
            Create New Task
          </Button>
          <Button
            type="default"
            onClick={() => navigate("/tasks/overdue")}
            className="overdue-task-button"
          >
            Overdue Tasks
          </Button>
        </Col>
      </Row>
      {loading ? (
        <div className="task-list-spin">
          <Spin tip="Loading tasks..." size="large" />
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </div>
      )}
    </div>
  )
}

export default TaskList
