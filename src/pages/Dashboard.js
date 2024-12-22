import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import TaskService from '../services/TaskService';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { useDrop } from 'react-dnd';

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });

  // Fetch tasks from the backend
  useEffect(() => {
    TaskService.getTasks()
      .then((response) => {
        const groupedTasks = {
          todo: response.data.filter((task) => task.status === 'To Do'),
          inProgress: response.data.filter((task) => task.status === 'In Progress'),
          done: response.data.filter((task) => task.status === 'Done'),
        };
        setTasks(groupedTasks);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  const handleDrop = (task, targetStatus) => {
    const updatedTask = { ...task, status: targetStatus };

    TaskService.updateTask(task.id, updatedTask)
      .then(() => {
        const updatedTasks = { ...tasks };
        Object.keys(updatedTasks).forEach((status) => {
          updatedTasks[status] = updatedTasks[status].filter((t) => t.id !== task.id);
        });
        updatedTasks[targetStatus].push(updatedTask);
        setTasks(updatedTasks);
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      alert('Title and description are required.');
      return;
    }

    TaskService.createTask(newTask)
      .then((response) => {
        const createdTask = response.data;
        setTasks((prevTasks) => ({
          ...prevTasks,
          todo: [...prevTasks.todo, createdTask],
        }));
        setNewTask({ title: '', description: '', status: 'To Do' });
      })
      .catch((error) => console.error('Error creating task:', error));
  };

  const handleDeleteTask = (id) => {
    TaskService.deleteTask(id)
      .then(() => {
        const updatedTasks = { ...tasks };
        Object.keys(updatedTasks).forEach((status) => {
          updatedTasks[status] = updatedTasks[status].filter((task) => task.id !== id);
        });
        setTasks(updatedTasks);
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  // Define useDrop hooks for each column
  const [{ isOver: isOverTodo }, dropRefTodo] = useDrop(() => ({
    accept: 'task',
    drop: (task) => handleDrop(task, 'todo'),
  }));

  const [{ isOver: isOverInProgress }, dropRefInProgress] = useDrop(() => ({
    accept: 'task',
    drop: (task) => handleDrop(task, 'inProgress'),
  }));

  const [{ isOver: isOverDone }, dropRefDone] = useDrop(() => ({
    accept: 'task',
    drop: (task) => handleDrop(task, 'done'),
  }));

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9fc', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: '600',
          color: '#333',
          fontFamily: 'San Francisco, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          mb: 4,
        }}
      >
        Task Management System
      </Typography>

      {/* Add Task Form */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <TextField
          label="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{
            width: '300px',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            '& .MuiInputBase-root': {
              borderRadius: '12px',
            },
          }}
          variant="outlined"
        />
        <TextField
          label="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          sx={{
            width: '300px',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            '& .MuiInputBase-root': {
              borderRadius: '12px',
            },
          }}
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={handleCreateTask}
          sx={{
            borderRadius: '12px',
            padding: '12px 24px',
            textTransform: 'none',
            backgroundColor: '#4caf50', // Light green
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          Add Task
        </Button>
      </Box>

      {/* Task Columns */}
      <Grid container spacing={4}>
        {['todo', 'inProgress', 'done'].map((column) => {
          let dropRef;
          switch (column) {
            case 'todo':
              dropRef = dropRefTodo;
              break;
            case 'inProgress':
              dropRef = dropRefInProgress;
              break;
            case 'done':
              dropRef = dropRefDone;
              break;
            default:
              break;
          }

          return (
            <Grid item xs={12} sm={4} key={column} ref={dropRef}>
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  p: 3,
                  minHeight: '400px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f8f9fd',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    fontWeight: '500',
                    color: '#555',
                    mb: 2,
                  }}
                  gutterBottom
                >
                  {column === 'todo' && 'To Do'}
                  {column === 'inProgress' && 'In Progress'}
                  {column === 'done' && 'Done'}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  {tasks[column].map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} />
                  ))}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;
