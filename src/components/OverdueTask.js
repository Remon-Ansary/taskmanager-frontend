// src/components/OverdueTask.js
import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Table, Button, Spin, message, Row, Col } from "antd"
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import "./OverdueTask.css"

const OverdueTask = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchOverdueTasks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        "http://localhost:8000/api/tasks/overdue/"
      )
      setTasks(response.data)
      message.success("Overdue tasks loaded successfully.")
    } catch (error) {
      console.error("Error fetching overdue tasks:", error)
      message.error("Failed to fetch overdue tasks.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOverdueTasks()
  }, [fetchOverdueTasks])

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
      fetchOverdueTasks()
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
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
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
    },
  ]

  return (
    <div className="overdue-task-container">
      <h2 className="overdue-task-header">Overdue Tasks</h2>
      {loading ? (
        <div className="overdue-task-spin">
          <Spin tip="Loading overdue tasks..." size="large" />
        </div>
      ) : tasks.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </div>
      ) : (
        <p>No overdue tasks found.</p>
      )}
    </div>
  )
}

export default OverdueTask
