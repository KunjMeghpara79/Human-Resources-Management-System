const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        default: null
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['COMPANY', 'DEPARTMENT', 'TEAM', 'DIVISION'],
        default: 'DEPARTMENT'
    },
    hierarchyLevel: { type: Number, default: 0 },
    metadata: {
        budget: Number,
        location: String,
        description: String
    }
}, { timestamps: true });

// Index for efficient hierarchy queries
organizationSchema.index({ parent: 1 });
organizationSchema.index({ manager: 1 });

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;

