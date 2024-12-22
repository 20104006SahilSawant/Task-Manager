import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/tasks';

const getTasks = () => {
  return axios.get(API_BASE_URL);
};

const createTask = (task) => {
  return axios.post(API_BASE_URL, task);
};

const updateTask = (id, updatedTask) => {
  // Correctly use template literals for the URL
  return axios.put(`${API_BASE_URL}/${id}`, updatedTask);
};

const deleteTask = (id) => {
  // Correctly use template literals for the URL
  return axios.delete(`${API_BASE_URL}/${id}`);
};

const TaskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default TaskService;
