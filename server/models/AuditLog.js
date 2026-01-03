const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT',
            'APPROVE', 'REJECT', 'EXPORT', 'IMPORT', 'DOWNLOAD'
        ]
    },
    resource: {
        type: String,
        required: true,
        enum: ['USER', 'ATTENDANCE', 'LEAVE', 'PAYROLL', 'PERFORMANCE', 'DOCUMENT', 'SETTINGS']
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    details: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
        changes: [String]
    },
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE', 'PENDING'],
        default: 'SUCCESS'
    },
    errorMessage: String
}, { timestamps: true });

// Indexes for efficient querying
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1, resource: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;

