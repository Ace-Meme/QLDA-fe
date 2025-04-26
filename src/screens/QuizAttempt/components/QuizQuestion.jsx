import React from 'react';
import {
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Box
} from '@mui/material';

const QuizQuestion = ({ question, selectedAnswer, onAnswerSelect, index, disabled }) => {
  if (!question) return null;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Question {index + 1}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {question.questionText}
      </Typography>
      <FormControl component="fieldset" disabled={disabled}>
        <RadioGroup
          value={selectedAnswer || ''}
          onChange={(e) => onAnswerSelect(question.id, e.target.value)}
        >
          {question.options?.map((option, idx) => (
            <FormControlLabel
              key={idx}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

export default QuizQuestion;
