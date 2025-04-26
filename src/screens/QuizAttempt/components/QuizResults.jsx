import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const QuizResults = ({ results }) => {
  console.log('Rendering QuizResults with:', results);
  
  if (!results) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quiz Results
        </Typography>
        <Typography variant="body1">
          No results available
        </Typography>
      </Paper>
    );
  }

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quiz Results: {results.quizTitle}
      </Typography>

      <Box sx={{ mt: 2, mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Score: {results.totalScore}/{results.maxPossibleScore} ({results.percentageScore}%)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start Time: {formatTime(results.startTime)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          End Time: {formatTime(results.endTime)}
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Detailed Responses
      </Typography>

      <List>
        {results.responses.map((response, index) => (
          <React.Fragment key={response.id}>
            {index > 0 && <Divider />}
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
                  Question {index + 1}
                </Typography>
                <Chip
                  icon={response.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                  label={response.isCorrect ? 'Correct' : 'Incorrect'}
                  color={response.isCorrect ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" gutterBottom>
                {response.questionText}
              </Typography>
              
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color={response.isCorrect ? 'success.main' : 'error.main'}>
                  Your Answer: {response.selectedAnswer}
                </Typography>
                {!response.isCorrect && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                    Correct Answer: {response.correctAnswer}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Points: {response.pointsEarned}/{response.isCorrect ? response.pointsEarned : 1}
              </Typography>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default QuizResults;
