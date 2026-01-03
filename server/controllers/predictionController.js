const { predictLeave, predictAttrition } = require('../services/aiPredictionService');
const { LeavePrediction, AttritionPrediction } = require('../models/AIPrediction');

exports.predictLeave = async (req, res) => {
    try {
        const prediction = await predictLeave(req.params.employeeId);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.predictAttrition = async (req, res) => {
    try {
        const prediction = await predictAttrition(req.params.employeeId);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttritionPredictions = async (req, res) => {
    try {
        const query = {};
        
        if (req.query.riskLevel) {
            query.riskLevel = req.query.riskLevel;
        }

        const predictions = await AttritionPrediction.find(query)
            .populate('employee', 'name email department jobTitle')
            .sort({ riskScore: -1 });

        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLeavePredictions = async (req, res) => {
    try {
        const predictions = await LeavePrediction.find({
            employee: req.params.employeeId
        })
            .sort({ predictedDate: 1 });

        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

