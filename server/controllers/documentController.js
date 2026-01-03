const Document = require('../models/Document');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const document = new Document({
            employee: req.body.employeeId || req.user._id,
            title: req.body.title,
            category: req.body.category || 'OTHER',
            versions: [{
                version: 1,
                filePath: req.file.path,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                uploadedBy: req.user._id
            }],
            metadata: req.body.metadata || {}
        });

        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const query = {};
        
        if (req.user.role === 'EMPLOYEE') {
            query.employee = req.user._id;
        } else if (req.query.employeeId) {
            query.employee = req.query.employeeId;
        }

        const documents = await Document.find(query)
            .populate('employee', 'name email')
            .sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('employee', 'name email')
            .populate('versions.uploadedBy', 'name');

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addVersion = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const newVersion = document.currentVersion + 1;
        document.versions.push({
            version: newVersion,
            filePath: req.file.path,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            uploadedBy: req.user._id,
            changeLog: req.body.changeLog || 'Updated document'
        });

        document.currentVersion = newVersion;
        await document.save();

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVersions = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(document.versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

