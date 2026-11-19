
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the login token to protected requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;


export const getTasks = () => API.get("/tasks");

export const createTask = (taskData) =>
  API.post("/tasks", taskData);

export const updateTask = (taskId, taskData) =>
  API.put(`/tasks/${taskId}`, taskData);

export const deleteTask = (taskId) =>
  API.delete(`/tasks/${taskId}`);
