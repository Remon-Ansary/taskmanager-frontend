import React, { createContext, useState, useEffect } from "react"
import axios from "axios"
import { message } from "antd" 

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]) 
  const [loading, setLoading] = useState(false) 
  const [error, setError] = useState(null) 

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8000/api/tasks/")
      setTasks(response.data.results || response.data) 
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to fetch tasks.")
      message.error("Failed to fetch tasks.")
    } finally {
      setLoading(false)
    }
  }

  // Add a new task
  const addTask = async (taskData) => {
    setLoading(true)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/tasks/",
        taskData
      )
      setTasks((prevTasks) => [...prevTasks, response.data])
      setError(null)
      message.success("Task created successfully.")
    } catch (err) {
      console.error("Error adding task:", err)
      setError("Failed to add task.")
      message.error("Failed to add task.")
    } finally {
      setLoading(false)
    }
  }

  // Update an existing task
  const updateTask = async (id, updatedData) => {
    setLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tasks/${id}/`,
        updatedData
      )
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      )
      setError(null)
      message.success("Task updated successfully.")
    } catch (err) {
      console.error("Error updating task:", err)
      setError("Failed to update task.")
      message.error("Failed to update task.")
    } finally {
      setLoading(false)
    }
  }

  // Delete a task
  const deleteTask = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
      setError(null)
      message.success("Task deleted successfully.")
    } catch (err) {
      console.error("Error deleting task:", err)
      setError("Failed to delete task.")
      message.error("Failed to delete task.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
