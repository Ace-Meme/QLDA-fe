import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const mockCourses = [
    {
        id: 1,
        name: "Course 1",
        chapters: [
            { id: 1, name: "Chapter 1" },
            { id: 2, name: "Chapter 2" },
        ],
    },
    {
        id: 2,
        name: "Course 2",
        chapters: [
            { id: 3, name: "Chapter 1" },
            { id: 4, name: "Chapter 2" },
        ],
    },
];

const mockQuestions = [
    {
        id: 1,
        question: "What is React?",
        options: ["A library", "A framework", "A language", "A database"],
        correctAnswer: 0,
        courseId: 1,
        chapterId: 1,
    },
    {
        id: 2,
        question: "What is JSX?",
        options: ["JavaScript XML", "Java XML", "JSON XML", "JavaScript XHR"],
        correctAnswer: 0,
        courseId: 1,
        chapterId: 2,
    },
    // Add more mock questions as needed
];

const QuizScreen = () => {
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedChapter, setSelectedChapter] = useState("");
    const [filteredQuestions, setFilteredQuestions] = useState([]);

    useEffect(() => {
        if (!showResults) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setShowResults(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [showResults]);

    useEffect(() => {
        // Filter questions based on selected course and chapter
        let filtered = [...mockQuestions];
        if (selectedCourse) {
            filtered = filtered.filter((q) => q.courseId === selectedCourse);
            if (selectedChapter) {
                filtered = filtered.filter((q) => q.chapterId === selectedChapter);
            }
        }
        setFilteredQuestions(filtered);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        setTimeLeft(30 * 60);
    }, [selectedCourse, selectedChapter]);

    const handleAnswerSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex,
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const calculateScore = () => {
        let correct = 0;
        filteredQuestions.forEach((question) => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correct++;
            }
        });
        return (correct / filteredQuestions.length) * 100;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const selectedCourseData = mockCourses.find((c) => c.id === selectedCourse);

    if (filteredQuestions.length === 0) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Take Quiz
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Select Course</InputLabel>
                        <Select
                            value={selectedCourse}
                            label="Select Course"
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedChapter("");
                            }}
                        >
                            {mockCourses.map((course) => (
                                <MenuItem
                                    key={course.id}
                                    value={course.id}
                                >
                                    {course.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Select Chapter</InputLabel>
                        <Select
                            value={selectedChapter}
                            label="Select Chapter"
                            onChange={(e) => setSelectedChapter(e.target.value)}
                            disabled={!selectedCourse}
                        >
                            <MenuItem value="">All Chapters</MenuItem>
                            {selectedCourseData?.chapters.map((chapter) => (
                                <MenuItem
                                    key={chapter.id}
                                    value={chapter.id}
                                >
                                    {chapter.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Typography>
                    No questions available for the selected criteria. Please select a different course or chapter.
                </Typography>
            </Box>
        );
    }

    if (showResults) {
        const score = calculateScore();
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Quiz Results
                </Typography>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Score: {score.toFixed(1)}%
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                    >
                        Correct Answers: {Math.round((score / 100) * filteredQuestions.length)} out of{" "}
                        {filteredQuestions.length}
                    </Typography>
                </Paper>

                {filteredQuestions.map((question, index) => (
                    <Paper
                        key={question.id}
                        sx={{ p: 3, mb: 2 }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Question {index + 1}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                        >
                            {question.question}
                        </Typography>
                        <Box sx={{ ml: 2 }}>
                            {question.options.map((option, optionIndex) => (
                                <Typography
                                    key={optionIndex}
                                    sx={{
                                        color:
                                            optionIndex === question.correctAnswer
                                                ? "success.main"
                                                : selectedAnswers[question.id] === optionIndex &&
                                                  selectedAnswers[question.id] !== question.correctAnswer
                                                ? "error.main"
                                                : "inherit",
                                    }}
                                >
                                    {optionIndex === question.correctAnswer && "✓ "}
                                    {selectedAnswers[question.id] === optionIndex &&
                                        selectedAnswers[question.id] !== question.correctAnswer &&
                                        "✗ "}
                                    {option}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                ))}

                <Button
                    variant="contained"
                    onClick={() => {
                        setShowResults(false);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers({});
                        setTimeLeft(30 * 60);
                    }}
                >
                    Take Another Quiz
                </Button>
            </Box>
        );
    }

    const currentQuestion = filteredQuestions[currentQuestionIndex];

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">Quiz</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress
                        variant="determinate"
                        value={(timeLeft / (30 * 60)) * 100}
                        size={30}
                        sx={{ mr: 1 }}
                    />
                    <Typography>{formatTime(timeLeft)}</Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select
                        value={selectedCourse}
                        label="Course"
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedChapter("");
                        }}
                    >
                        {mockCourses.map((course) => (
                            <MenuItem
                                key={course.id}
                                value={course.id}
                            >
                                {course.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Chapter</InputLabel>
                    <Select
                        value={selectedChapter}
                        label="Chapter"
                        onChange={(e) => setSelectedChapter(e.target.value)}
                        disabled={!selectedCourse}
                    >
                        <MenuItem value="">All Chapters</MenuItem>
                        {selectedCourseData?.chapters.map((chapter) => (
                            <MenuItem
                                key={chapter.id}
                                value={chapter.id}
                            >
                                {chapter.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                >
                    Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </Typography>
                <Typography
                    variant="h6"
                    gutterBottom
                >
                    {currentQuestion.question}
                </Typography>

                <FormControl
                    component="fieldset"
                    fullWidth
                >
                    <RadioGroup
                        value={selectedAnswers[currentQuestion.id] ?? ""}
                        onChange={(e) => handleAnswerSelect(currentQuestion.id, Number(e.target.value))}
                    >
                        {currentQuestion.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={index}
                                control={<Radio />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    variant="outlined"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>
                {currentQuestionIndex === filteredQuestions.length - 1 ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={Object.keys(selectedAnswers).length !== filteredQuestions.length}
                    >
                        Submit
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleNextQuestion}
                    >
                        Next
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default QuizScreen;
