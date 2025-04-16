import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const QuestionForm = ({ questionNumber, onDelete, questionData, onChange }) => {
  const handleQuestionChange = (e) => {
    onChange({ ...questionData, question: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    onChange({ ...questionData, options: newOptions });
  };

  const handleAddOption = () => {
    onChange({ ...questionData, options: [...questionData.options, ''] });
  };

  const handleRemoveOption = (index) => {
    const newOptions = questionData.options.filter((_, i) => i !== index);
    const newCorrect = questionData.correctAnswer >= index
      ? Math.max(0, questionData.correctAnswer - 1)
      : questionData.correctAnswer;
    onChange({ ...questionData, options: newOptions, correctAnswer: newCorrect });
  };

  const handleCorrectAnswerChange = (e) => {
    onChange({ ...questionData, correctAnswer: Number(e.target.value) });
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Question #{questionNumber}</Typography>
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <TextField
        fullWidth
        label="Question"
        value={questionData.question}
        onChange={handleQuestionChange}
        margin="normal"
        required
        multiline
        rows={2}
      />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Answer Options
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={questionData.correctAnswer}
          onChange={handleCorrectAnswerChange}
        >
          {questionData.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormControlLabel
                value={index}
                control={<Radio />}
                label=""
              />
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                sx={{ mr: 1 }}
              />
              {questionData.options.length > 2 && (
                <IconButton
                  onClick={() => handleRemoveOption(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddOption}
        >
          Add Option
        </Button>
      </Box>
    </Paper>
  );
};

const CreateQuestion = ({ courseId, chapterId }) => {
  const [questions, setQuestions] = useState([
    { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    setQuestions([
      ...questions,
      { id: newId, question: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleChangeQuestion = (id, updatedData) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updatedData } : q)));
  };

  const handleSubmitAll = async () => {
    console.log('Saving questions for:', { courseId, chapterId });
    console.log('Questions:', questions);
    // TODO: Replace with actual API call
    try {
      // await axios.post('/api/questions', { courseId, chapterId, questions });
      setQuestions([
        { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 },
      ]);
    } catch (err) {
      console.error('Error saving questions:', err);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create Questions
      </Typography>

      {questions.map((q, idx) => (
        <QuestionForm
          key={q.id}
          questionNumber={idx + 1}
          questionData={q}
          onDelete={() => handleRemoveQuestion(q.id)}
          onChange={(data) => handleChangeQuestion(q.id, data)}
        />
      ))}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
        >
          Add New Question
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitAll}
        >
          Save All Questions
        </Button>
      </Box>
    </Box>
  );
};

export default CreateQuestion;
