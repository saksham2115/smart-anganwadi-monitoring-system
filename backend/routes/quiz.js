const express = require('express');
const jwt = require('jsonwebtoken');
const Quiz = require('../models/Quiz');
const aiService = require('../services/aiService');

const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Generate Quiz
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const { examName, topic, difficulty } = req.body;
        
        // Generate questions using AI
        const questions = await aiService.generateQuiz(examName, topic, difficulty);

        const newQuiz = new Quiz({
            userId: req.user.userId,
            examName,
            topic,
            difficulty,
            questions
        });

        await newQuiz.save();
        res.json(newQuiz);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Submit Quiz and Evaluate
router.post('/:quizId/submit', authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body; // answers: { questionId: "selectedAnswer" }
        const quizId = req.params.quizId;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        if (quiz.userId.toString() !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

        let score = 0;
        let weakAreasMap = {};

        quiz.questions.forEach((q, index) => {
            const userAnswer = answers[q._id.toString()];
            if (userAnswer === q.correctAnswer) {
                score++;
            } else {
                // simple weak area tracking by topic, could be enhanced with tags per question
                weakAreasMap[quiz.topic] = (weakAreasMap[quiz.topic] || 0) + 1;
            }
        });

        quiz.score = score;
        quiz.weakAreas = Object.keys(weakAreasMap); // simple placeholder logic
        await quiz.save();

        res.json({ score, total: quiz.questions.length, weakAreas: quiz.weakAreas });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get User Dashboard (Recent Quizzes)
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
