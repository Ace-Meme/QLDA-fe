import { useState, useEffect } from 'react';
import { 
  startQuizAttempt, 
  submitQuizAnswers, 
  completeQuizAttempt, 
  getCurrentUserQuizAttempts,
  getQuestionsByQuizBankId 
} from '../../../api';

const useQuizAttempt = (learningItemId, navigate) => {
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const initQuiz = async () => {
    if (learningItemId) {
      try {
        setLoading(true);
        setError('');
        
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          throw new Error('You must be logged in to take a quiz');
        }

        // Try to start a new quiz attempt first
        try {
          const response = await startQuizAttempt(parseInt(learningItemId));
          if (response.status === 'SUCCESS') {
            setQuizAttempt(response.data);
            if (response.data.questions) {
              setQuestions(response.data.questions);
            }
            return;
          }
        } catch (startError) {
          // If we get "already in progress" error, continue to find existing attempt
          if (startError.response?.data?.message !== 'There is already an in-progress quiz attempt') {
            throw startError;
          }
        }
        
        // If we get here, either there's an existing attempt or start attempt failed
        console.log('Retrieving existing attempt.a..');
        const attemptsResponse = await getCurrentUserQuizAttempts();
        console.log('Existing attempts response:', attemptsResponse);
        if (attemptsResponse.result === 'SUCCESS') {
          const activeAttempt = attemptsResponse.data.find(attempt =>
            attempt.learningItemId === parseInt(learningItemId) && 
            attempt.status === 'IN_PROGRESS'
          );
          if (activeAttempt) {
            // Get questions from quiz bank
            console.log('Found active attempt:', activeAttempt);
            const questionsResponse = await getQuestionsByQuizBankId(activeAttempt.quizBankId);
            if (questionsResponse.result === 'SUCCESS') {
              setQuizAttempt(activeAttempt);
              console.log('quizattempt:', activeAttempt);
              setQuestions(questionsResponse.data);
              console.log('questions:', questionsResponse.data);
              // Restore any previously selected answers if they exist
              if (activeAttempt.answers) {
                const savedAnswers = {};
                activeAttempt.answers.forEach(answer => {
                  savedAnswers[answer.questionId] = answer.selectedAnswer;
                });
                setSelectedAnswers(savedAnswers);
              }
              return;
            }
          }
        }
        
        // If we get here, something went wrong
        throw new Error('Failed to retrieve quiz attempt');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while starting the quiz');
        if (err.message.includes('must be logged in')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      // Format answers for API
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer: selectedAnswer
      }));
      
      // Submit all answers
      if (formattedAnswers.length > 0 && quizAttempt) {
        const submitResponse = await submitQuizAnswers(quizAttempt.id, formattedAnswers);
        if (submitResponse.result !== 'SUCCESS') {
          throw new Error(submitResponse.message || 'Failed to submit answers');
        }
      }
      
      // Complete the quiz attempt
      if (quizAttempt) {
        const result = await completeQuizAttempt(quizAttempt.id);
        console.log('Complete quiz response:', result);
        if (result.result === 'SUCCESS') {
          setQuizResults(result.data);
          setShowResults(true);
        } else {
          throw new Error(result.message || 'Failed to complete quiz');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while submitting the quiz');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    quizAttempt,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswers,
    setSelectedAnswers,
    quizResults,
    showResults,
    loading,
    submitting,
    error,
    initQuiz,
    handleSubmit,
    snackbarOpen,
    setSnackbarOpen
  };
};

export default useQuizAttempt;
