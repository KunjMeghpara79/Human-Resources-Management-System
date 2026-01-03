const mongoose = require('mongoose');

const okrSchema = new mongoose.Schema({
    objective: { type: String, required: true },
    keyResults: [{
        description: String,
        target: Number,
        current: { type: Number, default: 0 },
        unit: String
    }],
    status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'NOT_STARTED'
    },
    dueDate: Date,
    progress: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

const peerFeedbackSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: String,
    categories: {
        communication: { type: Number, min: 1, max: 5 },
        teamwork: { type: Number, min: 1, max: 5 },
        problemSolving: { type: Number, min: 1, max: 5 },
        leadership: { type: Number, min: 1, max: 5 }
    }
}, { timestamps: true });

const performanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewPeriod: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        type: { type: String, enum: ['QUARTERLY', 'ANNUAL', 'MONTHLY'], default: 'QUARTERLY' }
    },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    okrs: [okrSchema],
    peerFeedbacks: [peerFeedbackSchema],
    managerFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comments: String,
        strengths: [String],
        areasForImprovement: [String]
    },
    selfAssessment: {
        rating: { type: Number, min: 1, max: 5 },
        comments: String,
        achievements: [String]
    },
    status: {
        type: String,
        enum: ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'],
        default: 'DRAFT'
    }
}, { timestamps: true });

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;

