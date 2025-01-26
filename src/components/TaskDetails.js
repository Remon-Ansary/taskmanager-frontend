import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { Card, Button, Spin, Descriptions, message } from "antd"
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import moment from "moment"

const TaskDetails = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tasks/${id}/`
        )
        console.log(response.data)
        setTask(response.data)
      } catch (error) {
        console.error("Error fetching task:", error)
        message.error("Failed to load task details.")
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id])

  const handleEdit = () => {
    navigate(`/tasks/${id}/edit`)
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin tip="Loading task details..." size="large" />
      </div>
    )
  }

  if (!task) {
    return (
      <Card title="Task Not Found">
        <p>The task you are looking for does not exist.</p>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/tasks")}
        >
          Back to Task List
        </Button>
      </Card>
    )
  }

  return (
    <div>
      <Card
        title={task.title}
        extra={
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Edit Task
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Description">
            {task.description || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{task.status}</Descriptions.Item>
          <Descriptions.Item label="Due Date">
            {moment(task.due_date, "YYYY-MM-DD").format("MMMM Do, YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(task.created_at).format("MMMM Do, YYYY h:mm A")}
          </Descriptions.Item>
        </Descriptions>
        <Button
          type="default"
          style={{ marginTop: "16px" }}
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/tasks")}
        >
          Back to Task List
        </Button>
      </Card>
    </div>
  )
}

export default TaskDetails 