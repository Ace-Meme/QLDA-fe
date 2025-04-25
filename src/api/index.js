import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests if available
API.interceptors.request.use((config) => {
    // Try to get token from sessionStorage first (where Login.jsx stores it)
    let token = sessionStorage.getItem('token');
    
    // If not found in sessionStorage, try localStorage as fallback
    if (!token) {
        token = localStorage.getItem('token');
    }
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const signUpUser = async (params) => {
    try {
        const response = await API.post("/register/student", params);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// =============== Quiz Taking API (QuizController) ===============

/**
 * Start a new quiz attempt for a specific learning item
 * @param {number} learningItemId - ID of the learning item (quiz) to attempt
 * @returns {Promise<Object>} Quiz attempt data
 */
export const startQuizAttempt = async (learningItemId) => {
    try {
        const response = await API.post("/api/quizzes/attempt", { learningItemId });
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Submit multiple answers for questions in an active quiz attempt
 * @param {number} quizAttemptId - ID of the quiz attempt
 * @param {Array<Object>} answers - Array of answers with questionId and selectedAnswer
 * @returns {Promise<Object>} Processed student responses
 */
export const submitQuizAnswers = async (quizAttemptId, answers) => {
    try {
        const response = await API.put(`/api/quizzes/attempt/${quizAttemptId}/answers`, answers);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Complete a quiz attempt and get results
 * @param {number} quizAttemptId - ID of the quiz attempt to complete
 * @returns {Promise<Object>} Quiz results with score and answers
 */
export const completeQuizAttempt = async (quizAttemptId) => {
    try {
        const response = await API.put(`/api/quizzes/attempt/${quizAttemptId}/complete`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get quiz results for a student
 * @param {number} studentId - ID of the student
 * @returns {Promise<Object>} List of quiz results for the student
 */
export const getStudentQuizResults = async (studentId) => {
    try {
        const response = await API.get(`/api/quizzes/results/student/${studentId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get quiz results for a course
 * @param {number} courseId - ID of the course
 * @returns {Promise<Object>} List of quiz results for the course
 */
export const getCourseQuizResults = async (courseId) => {
    try {
        const response = await API.get(`/api/quizzes/results/course/${courseId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// =============== Quiz Bank Management API (QuizBankController) ===============

/**
 * Create a new quiz bank
 * @param {Object} quizBankData - Quiz bank creation data with title and description
 * @returns {Promise<Object>} Created quiz bank
 */
export const createQuizBank = async (quizBankData) => {
    try {
        // Ensure we're only sending the fields expected by the backend
        const payload = {
            title: quizBankData.title,
            description: quizBankData.description
        };
        const response = await API.post("/api/quiz-banks", payload);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get a quiz bank by ID
 * @param {number} quizBankId - ID of the quiz bank
 * @returns {Promise<Object>} Quiz bank data
 */
export const getQuizBankById = async (quizBankId) => {
    try {
        const response = await API.get(`/api/quiz-banks/${quizBankId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get all active quiz banks
 * @returns {Promise<Object>} List of all active quiz banks
 */
export const getAllQuizBanks = async () => {
    try {
        const response = await API.get("/api/quiz-banks");
        console.log('API response from getAllQuizBanks:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error in getAllQuizBanks:', err);
        throw err;
    }
};

/**
 * Get quiz banks by teacher ID
 * @param {number} teacherId - ID of the teacher
 * @returns {Promise<Object>} List of quiz banks created by the teacher
 */
export const getQuizBanksByTeacherId = async (teacherId) => {
    try {
        const response = await API.get(`/api/quiz-banks/teacher/${teacherId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Update a quiz bank
 * @param {number} quizBankId - ID of the quiz bank to update
 * @param {Object} updateData - Quiz bank update data
 * @returns {Promise<Object>} Updated quiz bank
 */
export const updateQuizBank = async (quizBankId, updateData) => {
    try {
        const response = await API.put(`/api/quiz-banks/${quizBankId}`, updateData);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Delete a quiz bank (soft delete)
 * @param {number} quizBankId - ID of the quiz bank to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteQuizBank = async (quizBankId) => {
    try {
        const response = await API.delete(`/api/quiz-banks/${quizBankId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Associate a quiz bank with a learning item
 * @param {number} quizBankId - ID of the quiz bank
 * @param {Object} associationData - Association data with learningItemId
 * @returns {Promise<Object>} Updated learning item
 */
export const associateQuizBankWithLearningItem = async (quizBankId, associationData) => {
    try {
        const response = await API.put(`/api/quiz-banks/${quizBankId}/learning-items`, associationData);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Create a new quiz bank with random questions from another quiz bank
 * @param {Object} quizBankData - Quiz bank creation data with title and description
 * @param {number} sourceQuizBankId - ID of the source quiz bank to get questions from
 * @param {number} questionCount - Number of random questions to include
 * @returns {Promise<Object>} Created quiz bank with questions
 */
export const createQuizBankWithRandomQuestions = async (quizBankData, sourceQuizBankId, questionCount = 10) => {
    try {
        // Step 1: Create the new quiz bank
        console.log('Creating new quiz bank:', quizBankData);
        const quizBankResponse = await createQuizBank(quizBankData);
        
        if (!quizBankResponse || quizBankResponse.result !== 'SUCCESS') {
            throw new Error(quizBankResponse?.message || 'Failed to create quiz bank');
        }
        
        const newQuizBankId = quizBankResponse.data.id;
        console.log('New quiz bank created with ID:', newQuizBankId);
        
        // Step 2: Get random questions from the source quiz bank
        console.log(`Getting ${questionCount} random questions from quiz bank ${sourceQuizBankId}`);
        const questionsResponse = await getRandomQuestionsByQuizBankId(sourceQuizBankId, questionCount);
        
        if (!questionsResponse || questionsResponse.result !== 'SUCCESS') {
            throw new Error(questionsResponse?.message || 'Failed to get random questions');
        }
        
        const randomQuestions = questionsResponse.data;
        console.log(`Got ${randomQuestions.length} random questions`);
        
        // Step 3: Add each question to the new quiz bank
        const addedQuestions = [];
        
        for (const question of randomQuestions) {
            // Create a copy of the question for the new quiz bank
            const questionData = {
                quizBankId: newQuizBankId,
                questionText: question.questionText,
                questionType: question.questionType,
                options: question.options,
                correctAnswer: question.correctAnswer
            };
            
            const addQuestionResponse = await createQuestion(questionData);
            
            if (addQuestionResponse && addQuestionResponse.result === 'SUCCESS') {
                addedQuestions.push(addQuestionResponse.data);
            }
        }
        
        console.log(`Added ${addedQuestions.length} questions to the new quiz bank`);
        
        // Return the created quiz bank with the added questions count
        return {
            result: 'SUCCESS',
            message: `Quiz bank created successfully with ${addedQuestions.length} random questions`,
            data: {
                ...quizBankResponse.data,
                questionCount: addedQuestions.length
            }
        };
    } catch (err) {
        console.error('Error creating quiz bank with random questions:', err);
        return {
            result: 'ERROR',
            message: err.message || 'An error occurred while creating quiz bank with random questions',
            data: null
        };
    }
};

// =============== Question Management API (QuestionController) ===============

/**
 * Create a new question
 * @param {Object} questionData - Question creation data
 * @returns {Promise<Object>} Created question
 */
export const createQuestion = async (questionData) => {
    try {
        // Ensure we're only sending the fields expected by the backend
        const payload = {
            quizBankId: questionData.quizBankId,
            questionText: questionData.questionText,
            questionType: "MULTIPLE_CHOICE", // Currently only supporting MULTIPLE_CHOICE
            options: questionData.options,
            correctAnswer: questionData.correctAnswer
        };
        const response = await API.post("/api/questions", payload);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get a question by ID
 * @param {number} questionId - ID of the question
 * @returns {Promise<Object>} Question data
 */
export const getQuestionById = async (questionId) => {
    try {
        const response = await API.get(`/api/questions/${questionId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get questions by quiz bank ID
 * @param {number} quizBankId - ID of the quiz bank
 * @returns {Promise<Object>} List of questions in the quiz bank
 */
export const getQuestionsByQuizBankId = async (quizBankId) => {
    try {
        const response = await API.get(`/api/questions/quiz-bank/${quizBankId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Get random questions from a quiz bank
 * @param {number} quizBankId - ID of the quiz bank
 * @param {number} count - Number of random questions to retrieve
 * @returns {Promise<Object>} List of random questions
 */
export const getRandomQuestionsByQuizBankId = async (quizBankId, count = 10) => {
    try {
        const response = await API.get(`/api/questions/quiz-bank/${quizBankId}/random?count=${count}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Update a question
 * @param {number} questionId - ID of the question to update
 * @param {Object} updateData - Question update data
 * @returns {Promise<Object>} Updated question
 */
export const updateQuestion = async (questionId, updateData) => {
    try {
        // Ensure we're only sending the fields expected by the backend
        const payload = {
            questionText: updateData.questionText,
            questionType: "MULTIPLE_CHOICE", // Currently only supporting MULTIPLE_CHOICE
            options: updateData.options,
            correctAnswer: updateData.correctAnswer
        };
        const response = await API.put(`/api/questions/${questionId}`, payload);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * Delete a question
 * @param {number} questionId - ID of the question to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteQuestion = async (questionId) => {
    try {
        console.log(`Deleting question with ID: ${questionId}`);
        const response = await API.delete(`/api/questions/${questionId}`);
        console.log('Delete question API response:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error in deleteQuestion API call:', err);
        throw err;
    }
};
