import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { Form, Input, Button, Select, Spin, message, Card, Row } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import moment from "moment"
import "./TaskForm.css"

const { Option } = Select

const TaskForm = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams() // If editing, 'id' will be present
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id) // Only load if editing

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        setInitialLoading(true)
        try {
          const response = await axios.get(
            `http://localhost:8000/api/tasks/${id}/`
          )
          const task = response.data
          form.setFieldsValue({
            title: task.title,
            description: task.description,
            status: task.status,
            due_date: task.due_date ? task.due_date : "", // Use string date for HTML input
          })
        } catch (error) {
          console.error("Error fetching task:", error)
          message.error("Failed to load task details.")
        } finally {
          setInitialLoading(false)
        }
      }

      fetchTask()
    }
  }, [id, form])

  const onFinish = async (values) => {
    setLoading(true)
    const payload = {
      ...values,
      due_date: values.due_date, // Already in 'YYYY-MM-DD' format from HTML input
    }

    try {
      if (id) {
        // Update existing task
        await axios.put(`http://localhost:8000/api/tasks/${id}/`, payload)
        message.success("Task updated successfully.")
      } else {
        // Create new task
        await axios.post("http://localhost:8000/api/tasks/", payload)
        message.success("Task created successfully.")
      }
      navigate("/tasks")
    } catch (error) {
      console.error("Error saving task:", error)
      message.error("Failed to save task.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="task-form-spin">
        <Spin tip="Loading task details..." size="large" />
      </div>
    )
  }

  return (
    <Card
      title={id ? "Edit Task" : "Create New Task"}
      extra={
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/tasks")}
        >
          Back to Task List
        </Button>
      }
      className="task-form-card"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: "Pending",
          due_date: "",
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter the task title." },
            { max: 255, message: "Title cannot exceed 255 characters." },
          ]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter the task description." },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter task description" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: "Please select the task status." },
          ]}
        >
          <Select placeholder="Select status">
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: "Please select the due date." }]}
        >
          {/* Native HTML Date Picker */}
          <Input
            type="date"
            placeholder="Select due date"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Row justify="end">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ minWidth: "120px" }}
            >
              {id ? "Update Task" : "Create Task"}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default TaskForm
