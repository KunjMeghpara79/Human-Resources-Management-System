const mongoose = require('mongoose');

const leavePredictionSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    predictedDate: Date,
    confidence: { type: Number, min: 0, max: 100 }, // percentage
    leaveType: {
        type: String,
        enum: ['PAID', 'SICK', 'UNPAID', 'CASUAL']
    },
    factors: [{
        name: String,
        weight: Number,
        impact: String // 'POSITIVE', 'NEGATIVE', 'NEUTRAL'
    }],
    modelVersion: String,
    predictedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const attritionPredictionSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: true
    },
    predictedResignationDate: Date,
    factors: [{
        name: String,
        weight: Number,
        impact: String
    }],
    recommendations: [String],
    modelVersion: String,
    predictedAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
leavePredictionSchema.index({ employee: 1, predictedDate: 1 });
attritionPredictionSchema.index({ employee: 1 });
attritionPredictionSchema.index({ riskLevel: 1, riskScore: -1 });

const LeavePrediction = mongoose.model('LeavePrediction', leavePredictionSchema);
const AttritionPrediction = mongoose.model('AttritionPrediction', attritionPredictionSchema);

module.exports = { LeavePrediction, AttritionPrediction };

