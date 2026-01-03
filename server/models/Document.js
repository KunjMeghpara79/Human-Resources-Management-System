const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema({
    version: { type: Number, required: true },
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: Number,
    mimeType: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedAt: { type: Date, default: Date.now },
    changeLog: String,
    checksum: String // For integrity verification
}, { timestamps: true });

const documentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    category: {
        type: String,
        enum: ['CONTRACT', 'ID_PROOF', 'EDUCATION', 'CERTIFICATE', 'OTHER'],
        default: 'OTHER'
    },
    currentVersion: { type: Number, default: 1 },
    versions: [documentVersionSchema],
    isActive: { type: Boolean, default: true },
    tags: [String],
    metadata: {
        expiryDate: Date,
        issuedBy: String,
        description: String
    }
}, { timestamps: true });

// Indexes
documentSchema.index({ employee: 1, category: 1 });
documentSchema.index({ 'versions.version': 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

