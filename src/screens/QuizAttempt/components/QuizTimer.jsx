import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const QuizTimer = ({ timeLeft, totalTime }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / totalTime) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Time Remaining: {formatTime(timeLeft)}
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default QuizTimer;
