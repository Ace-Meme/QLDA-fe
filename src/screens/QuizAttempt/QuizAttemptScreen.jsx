import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import QuizTimer from './components/QuizTimer';
import QuizQuestion from './components/QuizQuestion';
import QuizNavigation from './components/QuizNavigation';
import QuizResults from './components/QuizResults';
import useQuizAttempt from './hooks/useQuizAttempt';

const TOTAL_TIME = 30 * 60; // 30 minutes in seconds

const QuizAttemptScreen = () => {
  const { learningItemId } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(TOTAL_TIME);

  const {
    quizAttempt,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswers,
    setSelectedAnswers,
    quizResults,
    showResults,
    loading,
    error,
    submitting,
    initQuiz,
    handleSubmit,
    snackbarOpen,
    setSnackbarOpen
  } = useQuizAttempt(learningItemId, navigate);

  useEffect(() => {
    initQuiz();
  }, [learningItemId]);

  useEffect(() => {
    if (!showResults && quizAttempt) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showResults, quizAttempt]);

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedAnswer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading && !quizAttempt) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if ((!learningItemId || error) && !quizAttempt) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Error
        </Typography>
        <Typography variant="body1">
          {error || 'Invalid quiz attempt'}
        </Typography>
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  console.log('Show results:', showResults);
  console.log('Quiz results:', quizResults);

  if (showResults) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <QuizResults results={quizResults} />
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Return to Course
        </Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <QuizTimer timeLeft={timeLeft} totalTime={TOTAL_TIME} />
      
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswers[currentQuestion?.id]}
        onAnswerSelect={handleAnswerSelect}
        index={currentQuestionIndex}
        disabled={submitting}
      />
      
      <QuizNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizAttemptScreen;
