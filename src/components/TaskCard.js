import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, Typography, Button } from '@mui/material';

const TaskCard = ({ task, onDelete }) => {
  // Drag hook to make the task draggable
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'task',
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card
      sx={{
        mb: 2,
        opacity: isDragging ? 0.8 : 1,
        borderRadius: '16px',
        boxShadow: 4,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0px 6px 16px rgba(72, 206, 128, 0.4)', // Soft light green glow
        },
        background: 'linear-gradient(135deg, #e0f7fa, #b9f6ca)', // Soft gradient background
      }}
      ref={dragRef}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: '600',
            color: '#004d40', // Deep green for titles
            fontFamily: 'San Francisco, sans-serif',
          }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '14px',
            mb: 1,
            color: '#004d40', // Complementary deep green for descriptions
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {task.description}
        </Typography>
        <Typography
          variant="caption"
          color="success.main"
          sx={{
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '500',
          }}
        >
          Status: {task.status}
        </Typography>
        <Button
          color="success"
          variant="outlined"
          size="small"
          sx={{
            mt: 2,
            borderRadius: '12px',
            textTransform: 'none',
            borderColor: '#388e3c', // Dark green border
            '&:hover': {
              backgroundColor: '#a5d6a7', // Light green hover effect
              borderColor: '#2e7d32',
            },
          }}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
