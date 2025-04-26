import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

const QuizNavigation = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmit,
  isSubmitting
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Button
        variant="contained"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0 || isSubmitting}
      >
        Previous
      </Button>
      {currentQuestionIndex === totalQuestions - 1 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1 || isSubmitting}
        >
          Next
        </Button>
      )}
    </Box>
  );
};

export default QuizNavigation;
