// routes/medicalRoutes.js
const express = require('express');
const { analyzeReport } = require('../controllers/medicalController');

const router = express.Router();

// Definition of POST route for analyzing medical reports
router.post('/analyze', analyzeReport);

module.exports = router;
