import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {
  getAllQuizBanks,
  getQuizBankById,
  createQuizBank,
  updateQuizBank,
  deleteQuizBank,
  getQuestionsByQuizBankId,
  getRandomQuestionsByQuizBankId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createQuizBankWithRandomQuestions
} from '../api';

const QuizManagement = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Quiz bank states
  const [quizBanks, setQuizBanks] = useState([]);
  const [selectedQuizBank, setSelectedQuizBank] = useState(null);
  const [quizBankDialogOpen, setQuizBankDialogOpen] = useState(false);
  const [quizBankFormData, setQuizBankFormData] = useState({
    title: '',
    description: ''
  });

  // Question states
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  // Random questions states
  const [showRandomQuestions, setShowRandomQuestions] = useState(false);
  const [randomQuestionsCount, setRandomQuestionsCount] = useState(10);

  // Random quiz bank states
  const [randomQuizBankDialogOpen, setRandomQuizBankDialogOpen] = useState(false);
  const [randomQuizBankFormData, setRandomQuizBankFormData] = useState({
    title: '',
    description: '',
    questionCount: 10
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch quiz banks on component mount
  useEffect(() => {
    fetchQuizBanks();
  }, []);

  // Fetch questions when a quiz bank is selected
  useEffect(() => {
    if (selectedQuizBank) {
      if (showRandomQuestions) {
        fetchRandomQuestions(selectedQuizBank.id, randomQuestionsCount);
      } else {
        fetchQuestions(selectedQuizBank.id);
      }
    } else {
      setQuestions([]);
    }
  }, [selectedQuizBank, showRandomQuestions, randomQuestionsCount]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const QuizBankTab = ({ 
    quizBanks, 
    selectedQuizBank, 
    setSelectedQuizBank, 
    loading, 
    setLoading, 
    showSnackbar, 
    openQuizBankDialog, 
    handleDeleteQuizBank,
    openRandomQuizBankDialog
  }) => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Quiz Banks</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => openQuizBankDialog()}
            >
              Add Quiz Bank
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={openRandomQuizBankDialog}
            >
              Create from Random Questions
            </Button>
          </Box>
        </Box>

        {loading && quizBanks.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : quizBanks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No quiz banks found. Create your first quiz bank!</Typography>
          </Paper>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Questions</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizBanks.map((quizBank) => (
                    <TableRow
                      key={quizBank.id}
                      onClick={() => setSelectedQuizBank(quizBank)}
                      selected={selectedQuizBank && selectedQuizBank.id === quizBank.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{quizBank.title}</TableCell>
                      <TableCell>{quizBank.description}</TableCell>
                      <TableCell>{quizBank.createdByName}</TableCell>
                      <TableCell>{quizBank.questionCount || 0}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuizBankDialog(quizBank);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuizBank(quizBank.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    );
  };

  const QuestionsTab = ({ 
    selectedQuizBank, 
    questions, 
    loading, 
    showRandomQuestions, 
    toggleRandomQuestions, 
    randomQuestionsCount, 
    handleRandomQuestionsCountChange, 
    openQuestionDialog, 
    handleDeleteQuestion 
  }) => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Questions for: {selectedQuizBank?.title}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => openQuestionDialog()}
          >
            Add Question
          </Button>
        </Box>


        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No questions found. Add your first question!</Typography>
          </Paper>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Question Text</TableCell>
                    <TableCell>Correct Answer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.questionText}</TableCell>
                      <TableCell>{question.correctAnswer}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => openQuestionDialog(question)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    );
  };

  // Fetch quiz banks
  const fetchQuizBanks = async () => {
    try {
      setLoading(true);
      const response = await getAllQuizBanks();
      console.log('Quiz banks response:', response);
      
      if (response && response.result === 'SUCCESS' && Array.isArray(response.data)) {
        console.log('Setting quiz banks:', response.data);
        setQuizBanks(response.data);
      } else {
        console.error('Unexpected response format:', response);
        showSnackbar('Failed to fetch quiz banks: Unexpected response format', 'error');
      }
    } catch (err) {
      console.error('Error fetching quiz banks:', err);
      showSnackbar(err.message || 'An error occurred while fetching quiz banks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for a quiz bank
  const fetchQuestions = async (quizBankId) => {
    try {
      setLoading(true);
      const response = await getQuestionsByQuizBankId(quizBankId);
      console.log('Questions response:', response);
      
      if (response && response.result === 'SUCCESS' && Array.isArray(response.data)) {
        console.log('Setting questions:', response.data);
        setQuestions(response.data);
      } else {
        console.error('Unexpected questions response format:', response);
        showSnackbar('Failed to fetch questions: Unexpected response format', 'error');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      showSnackbar(err.message || 'An error occurred while fetching questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch random questions for a quiz bank
  const fetchRandomQuestions = async (quizBankId, count) => {
    try {
      setLoading(true);
      const response = await getRandomQuestionsByQuizBankId(quizBankId, count);
      console.log('Random questions response:', response);
      
      if (response && response.result === 'SUCCESS' && Array.isArray(response.data)) {
        console.log('Setting random questions:', response.data);
        setQuestions(response.data);
      } else {
        console.error('Unexpected random questions response format:', response);
        showSnackbar('Failed to fetch random questions: Unexpected response format', 'error');
      }
    } catch (err) {
      console.error('Error fetching random questions:', err);
      showSnackbar(err.message || 'An error occurred while fetching random questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle random questions display
  const toggleRandomQuestions = () => {
    setShowRandomQuestions(!showRandomQuestions);
  };

  // Handle random questions count change
  const handleRandomQuestionsCountChange = (event) => {
    setRandomQuestionsCount(Number(event.target.value));
  };

  // Quiz Bank Dialog Handlers
  const openQuizBankDialog = (quizBank = null) => {
    if (quizBank) {
      setQuizBankFormData({
        title: quizBank.title,
        description: quizBank.description
      });
      setSelectedQuizBank(quizBank);
    } else {
      setQuizBankFormData({
        title: '',
        description: ''
      });
      setSelectedQuizBank(null);
    }
    setQuizBankDialogOpen(true);
  };

  const closeQuizBankDialog = () => {
    setQuizBankDialogOpen(false);
  };

  const handleQuizBankFormChange = (e) => {
    const { name, value } = e.target;
    setQuizBankFormData({
      ...quizBankFormData,
      [name]: value
    });
  };

  const handleQuizBankSubmit = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedQuizBank) {
        // Update existing quiz bank
        response = await updateQuizBank(selectedQuizBank.id, quizBankFormData);
        if (response && response.result === 'SUCCESS') {
          showSnackbar('Quiz bank updated successfully', 'success');
          setQuizBanks(quizBanks.map(qb => 
            qb.id === selectedQuizBank.id ? response.data : qb
          ));
        } else {
          showSnackbar(response?.message || 'Failed to update quiz bank', 'error');
        }
      } else {
        // Create new quiz bank
        response = await createQuizBank(quizBankFormData);
        if (response && response.result === 'SUCCESS') {
          showSnackbar('Quiz bank created successfully', 'success');
          setQuizBanks([...quizBanks, response.data]);
        } else {
          showSnackbar(response?.message || 'Failed to create quiz bank', 'error');
        }
      }
      
      closeQuizBankDialog();
    } catch (err) {
      showSnackbar(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuizBank = async (quizBankId) => {
    if (window.confirm('Are you sure you want to delete this quiz bank?')) {
      try {
        setLoading(true);
        const response = await deleteQuizBank(quizBankId);
        console.log('Delete quiz bank response:', response);
        
        if (response && response.result === 'SUCCESS') {
          showSnackbar('Quiz bank deleted successfully', 'success');
          setQuizBanks(quizBanks.filter(qb => qb.id !== quizBankId));
          if (selectedQuizBank && selectedQuizBank.id === quizBankId) {
            setSelectedQuizBank(null);
            setQuestions([]);
          }
        } else {
          showSnackbar(response?.message || 'Failed to delete quiz bank', 'error');
        }
      } catch (err) {
        console.error('Error deleting quiz bank:', err);
        showSnackbar(err.message || 'An error occurred while deleting quiz bank', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Question Dialog Handlers
  const openQuestionDialog = (question = null) => {
    if (question) {
      console.log('Opening question dialog with question:', question);
      setQuestionFormData({
        questionText: question.questionText,
        questionType: question.questionType || 'MULTIPLE_CHOICE',
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer
      });
      setSelectedQuestion(question);
    } else {
      setQuestionFormData({
        questionText: '',
        questionType: 'MULTIPLE_CHOICE',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
      setSelectedQuestion(null);
    }
    setQuestionDialogOpen(true);
  };

  const closeQuestionDialog = () => {
    setQuestionDialogOpen(false);
  };

  const handleQuestionFormChange = (e) => {
    const { name, value } = e.target;
    setQuestionFormData({
      ...questionFormData,
      [name]: value
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionFormData.options];
    updatedOptions[index] = value;
    setQuestionFormData({
      ...questionFormData,
      options: updatedOptions
    });
  };

  const handleQuestionSubmit = async () => {
    if (!selectedQuizBank) {
      showSnackbar('Please select a quiz bank first', 'error');
      return;
    }

    try {
      setLoading(true);
      const questionData = {
        quizBankId: selectedQuizBank.id,
        questionText: questionFormData.questionText,
        questionType: questionFormData.questionType,
        options: questionFormData.options,
        correctAnswer: questionFormData.correctAnswer
      };
      
      console.log('Submitting question data:', questionData);

      let response;
      if (selectedQuestion) {
        // Update existing question
        response = await updateQuestion(selectedQuestion.id, questionData);
        console.log('Update question response:', response);
        
        if (response && response.result === 'SUCCESS') {
          showSnackbar('Question updated successfully', 'success');
          setQuestions(questions.map(q => 
            q.id === selectedQuestion.id ? response.data : q
          ));
        } else {
          showSnackbar(response?.message || 'Failed to update question', 'error');
        }
      } else {
        // Create new question
        response = await createQuestion(questionData);
        console.log('Create question response:', response);
        
        if (response && response.result === 'SUCCESS') {
          showSnackbar('Question created successfully', 'success');
          setQuestions([...questions, response.data]);
        } else {
          showSnackbar(response?.message || 'Failed to create question', 'error');
        }
      }
      
      closeQuestionDialog();
    } catch (err) {
      console.error('Error submitting question:', err);
      showSnackbar(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        setLoading(true);
        const response = await deleteQuestion(questionId);
        console.log('Delete question response:', response);
        
        if (response && response.result === 'SUCCESS') {
          showSnackbar('Question deleted successfully', 'success');
          setQuestions(questions.filter(q => q.id !== questionId));
        } else {
          showSnackbar(response?.message || 'Failed to delete question', 'error');
        }
      } catch (err) {
        console.error('Error deleting question:', err);
        showSnackbar(err.message || 'An error occurred while deleting question', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Random Quiz Bank Dialog Handlers
  const openRandomQuizBankDialog = () => {
    setRandomQuizBankFormData({
      title: '',
      description: '',
      questionCount: 10
    });
    setRandomQuizBankDialogOpen(true);
  };

  const closeRandomQuizBankDialog = () => {
    setRandomQuizBankDialogOpen(false);
  };

  const handleRandomQuizBankFormChange = (e) => {
    const { name, value } = e.target;
    setRandomQuizBankFormData({
      ...randomQuizBankFormData,
      [name]: name === 'questionCount' ? Number(value) : value
    });
  };

  const handleCreateRandomQuizBank = async () => {
    if (!selectedQuizBank) {
      showSnackbar('Please select a source quiz bank first', 'error');
      return;
    }

    try {
      setLoading(true);
      const quizBankData = {
        title: randomQuizBankFormData.title,
        description: randomQuizBankFormData.description
      };
      
      console.log('Creating quiz bank with random questions:', {
        quizBankData,
        sourceQuizBankId: selectedQuizBank.id,
        questionCount: randomQuizBankFormData.questionCount
      });
      
      const response = await createQuizBankWithRandomQuestions(
        quizBankData,
        selectedQuizBank.id,
        randomQuizBankFormData.questionCount
      );
      
      console.log('Create random quiz bank response:', response);
      
      if (response && response.result === 'SUCCESS') {
        showSnackbar(response.message, 'success');
        // Refresh the quiz banks list
        fetchQuizBanks();
        closeRandomQuizBankDialog();
      } else {
        showSnackbar(response?.message || 'Failed to create quiz bank with random questions', 'error');
      }
    } catch (err) {
      console.error('Error creating quiz bank with random questions:', err);
      showSnackbar(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Snackbar handler
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quiz Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Quiz Banks" />
          <Tab label="Questions" disabled={!selectedQuizBank} />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <QuizBankTab 
          quizBanks={quizBanks}
          selectedQuizBank={selectedQuizBank}
          setSelectedQuizBank={setSelectedQuizBank}
          loading={loading}
          setLoading={setLoading}
          showSnackbar={showSnackbar}
          openQuizBankDialog={() => openQuizBankDialog()}
          handleDeleteQuizBank={(id) => handleDeleteQuizBank(id)}
          openRandomQuizBankDialog={() => openRandomQuizBankDialog()}
        />
      ) : (
        <QuestionsTab 
          selectedQuizBank={selectedQuizBank}
          questions={questions}
          loading={loading}
          showRandomQuestions={showRandomQuestions}
          toggleRandomQuestions={toggleRandomQuestions}
          randomQuestionsCount={randomQuestionsCount}
          handleRandomQuestionsCountChange={handleRandomQuestionsCountChange}
          openQuestionDialog={() => openQuestionDialog()}
          handleDeleteQuestion={(id) => handleDeleteQuestion(id)}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Quiz Bank Dialog */}
      <Dialog open={quizBankDialogOpen} onClose={closeQuizBankDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuizBank ? 'Edit Quiz Bank' : 'Create Quiz Bank'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Quiz Bank Title"
            type="text"
            fullWidth
            value={quizBankFormData.title}
            onChange={handleQuizBankFormChange}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Quiz Bank Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={quizBankFormData.description}
            onChange={handleQuizBankFormChange}
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQuizBankDialog}>Cancel</Button>
          <Button 
            onClick={handleQuizBankSubmit} 
            variant="contained"
            disabled={loading || !quizBankFormData.title}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={questionDialogOpen} onClose={closeQuestionDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuestion ? 'Edit Question' : 'Add Question'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="questionText"
            label="Question Text"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={questionFormData.questionText}
            onChange={handleQuestionFormChange}
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" gutterBottom>Options</Typography>

          {questionFormData.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ mr: 2, width: '20px' }}>{String.fromCharCode(65 + index)}:</Typography>
              <TextField
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
              />
            </Box>
          ))}

          <FormControl fullWidth margin="dense" sx={{ mb: 3 }}>
            <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
            <Select
              labelId="correct-answer-label"
              name="correctAnswer"
              value={questionFormData.correctAnswer}
              onChange={handleQuestionFormChange}
              label="Correct Answer"
            >
              {questionFormData.options.map((option, index) => (
                option && (
                  <MenuItem key={index} value={option}>
                    {String.fromCharCode(65 + index)}: {option}
                  </MenuItem>
                )
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQuestionDialog}>Cancel</Button>
          <Button 
            onClick={handleQuestionSubmit} 
            variant="contained"
            disabled={loading || !questionFormData.questionText}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Random Quiz Bank Dialog */}
      <Dialog open={randomQuizBankDialogOpen} onClose={closeRandomQuizBankDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Create Quiz Bank with Random Questions
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Quiz Bank Title"
            type="text"
            fullWidth
            value={randomQuizBankFormData.title}
            onChange={handleRandomQuizBankFormChange}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Quiz Bank Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={randomQuizBankFormData.description}
            onChange={handleRandomQuizBankFormChange}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="dense"
            name="questionCount"
            label="Number of Questions"
            type="number"
            fullWidth
            value={randomQuizBankFormData.questionCount}
            onChange={handleRandomQuizBankFormChange}
            InputProps={{ inputProps: { min: 1, max: 50 } }}
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRandomQuizBankDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateRandomQuizBank} 
            variant="contained" 
            disabled={loading || !randomQuizBankFormData.title || !randomQuizBankFormData.description || !randomQuizBankFormData.questionCount}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizManagement;
