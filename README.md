# Task Manager Frontend

A React-based frontend application for managing tasks, built with Ant Design. It allows users to create, view, edit, delete, and filter tasks, as well as view overdue tasks.

## Features

- **Task List:** View and filter tasks by status.
- **Create/Edit Task:** Add or modify tasks with title, description, status, and due date.
- **Task Details:** View detailed information of a task.
- **Overdue Tasks:** Access a list of tasks past their due date.
- **Responsive Design:** Optimized for desktop and mobile devices.

## Technologies Used

- **React**
- **Ant Design**
- **React Router DOM**
- **Axios**
- **Moment.js**
- **Docker**
- **Nginx**

## Installation

### Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**
- **Docker** (optional)

### Steps

1. **Clone the Repository**

```bash
   cd taskmanager-frontend
   ```
2. Install Dependencies

```bash 
npm install
```
3.Start the development server:


```bash 
npm start
```

## Using Docker
Build the Docker Image

```bash 
docker build -t taskmanager-frontend .
docker run -d -p 3000:80 taskmanager-frontend
```