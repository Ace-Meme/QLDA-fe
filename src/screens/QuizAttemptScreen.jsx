import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import { startQuizAttempt, submitQuizAnswers, completeQuizAttempt } from '../api';

const QuizAttemptScreen = ({ learningItemId, onNavigateBack }) => {
  // State for quiz attempt
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Start quiz attempt when component mounts
  useEffect(() => {
    if (learningItemId) {
      startQuiz(learningItemId);
    }
  }, [learningItemId]);

  // Timer effect
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

  const startQuiz = async (itemId) => {
    try {
      setLoading(true);
      setError('');
      const response = await startQuizAttempt(itemId);
      if (response.status === 'SUCCESS') {
        setQuizAttempt(response.data);
        // Extract questions from the quiz attempt
        if (response.data.questions) {
          setQuestions(response.data.questions);
        }
      } else {
        setError(response.message || 'Failed to start quiz');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while starting the quiz');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Format answers for API
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer: selectedAnswer
      }));
      
      // Submit all answers
      if (formattedAnswers.length > 0 && quizAttempt) {
        await submitQuizAnswers(quizAttempt.id, formattedAnswers);
      }
      
      // Complete the quiz attempt
      if (quizAttempt) {
        const result = await completeQuizAttempt(quizAttempt.id);
        if (result.status === 'SUCCESS') {
          setQuizResults(result.data);
          setShowResults(true);
        } else {
          setError(result.message || 'Failed to complete quiz');
          setSnackbarOpen(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the quiz');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Loading state
  if (loading && !quizAttempt) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state or no learning item ID
  if ((!learningItemId || error) && !quizAttempt) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Error
        </Typography>
        <Typography variant="body1">
          {error || 'No quiz selected. Please select a quiz from your course.'}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }} 
          onClick={onNavigateBack}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // No questions available
  if (questions.length === 0 && !loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Take Quiz
        </Typography>
        <Typography>
          No questions available for this quiz. Please try another quiz.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }} 
          onClick={onNavigateBack}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Show results
  if (showResults && quizResults) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Score: {quizResults.percentageScore.toFixed(1)}%
          </Typography>
          <Typography variant="body1" gutterBottom>
            Correct Answers: {quizResults.correctAnswers} out of {quizResults.totalQuestions}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={quizResults.percentageScore} 
            sx={{ mt: 2, height: 10, borderRadius: 5 }}
            color={quizResults.percentageScore >= 70 ? "success" : quizResults.percentageScore >= 50 ? "warning" : "error"}
          />
        </Paper>

        {quizResults.responses && quizResults.responses.map((response, index) => (
          <Paper key={response.questionId} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Question {index + 1}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {response.questionText}
            </Typography>
            <Box sx={{ ml: 2 }}>
              {response.options && response.options.map((option, optionIndex) => {
                const optionKey = typeof option === 'object' ? option.key : String.fromCharCode(65 + optionIndex); // A, B, C, etc.
                const optionText = typeof option === 'object' ? option.text : option;
                const isCorrect = response.correctAnswer === optionKey;
                const isSelected = response.selectedAnswer === optionKey;
                
                return (
                  <Typography
                    key={optionIndex}
                    sx={{
                      color:
                        isCorrect
                          ? "success.main"
                          : isSelected && !isCorrect
                          ? "error.main"
                          : "inherit",
                      fontWeight: isCorrect || (isSelected && !isCorrect) ? 'bold' : 'normal',
                      my: 1
                    }}
                  >
                    {isCorrect && "✓ "}
                    {isSelected && !isCorrect && "✗ "}
                    {optionKey}: {optionText}
                  </Typography>
                );
              })}
            </Box>
          </Paper>
        ))}

        <Button
          variant="contained"
          onClick={onNavigateBack}
        >
          Return to Course
        </Button>
      </Box>
    );
  }

  // Quiz in progress
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Quiz</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress
            variant="determinate"
            value={(timeLeft / (30 * 60)) * 100}
            size={30}
            sx={{ mr: 1 }}
          />
          <Typography>{formatTime(timeLeft)}</Typography>
        </Box>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ mb: 3, height: 8, borderRadius: 5 }} 
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {currentQuestion.text || currentQuestion.question}
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
          >
            {currentQuestion.options && currentQuestion.options.map((option, index) => {
              const optionKey = typeof option === 'object' ? option.key : String.fromCharCode(65 + index); // A, B, C, etc.
              const optionText = typeof option === 'object' ? option.text : option;
              
              return (
                <FormControlLabel
                  key={index}
                  value={optionKey}
                  control={<Radio />}
                  label={`${optionKey}: ${optionText}`}
                  sx={{ my: 1 }}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || loading}
        >
          Previous
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={loading}
          >
            Next
          </Button>
        )}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizAttemptScreen;
