const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
    try {
        const { user, resource, action, startDate, endDate, limit = 100 } = req.query;
        const query = {};

        if (user) query.user = user;
        if (resource) query.resource = resource;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .populate('user', 'name email role')
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAuditLog = async (req, res) => {
    try {
        const log = await AuditLog.findById(req.params.id)
            .populate('user', 'name email role');

        if (!log) {
            return res.status(404).json({ message: 'Audit log not found' });
        }

        res.json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

