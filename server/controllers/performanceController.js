const Performance = require('../models/Performance');

exports.createPerformance = async (req, res) => {
    try {
        const performance = new Performance({
            ...req.body,
            employee: req.body.employeeId || req.user._id
        });
        await performance.save();
        res.status(201).json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPerformances = async (req, res) => {
    try {
        const query = {};
        
        // Employees can only see their own
        if (req.user.role === 'EMPLOYEE') {
            query.employee = req.user._id;
        } else if (req.query.employeeId) {
            query.employee = req.query.employeeId;
        }

        const performances = await Performance.find(query)
            .populate('employee', 'name email')
            .populate('peerFeedbacks.reviewer', 'name')
            .sort({ createdAt: -1 });

        res.json(performances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPerformance = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id)
            .populate('employee', 'name email department jobTitle')
            .populate('peerFeedbacks.reviewer', 'name email');

        if (!performance) {
            return res.status(404).json({ message: 'Performance review not found' });
        }

        // Check permission
        if (req.user.role === 'EMPLOYEE' && 
            performance.employee._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePerformance = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: 'Performance review not found' });
        }

        Object.assign(performance, req.body);
        await performance.save();

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addOKR = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: 'Performance review not found' });
        }

        performance.okrs.push(req.body);
        await performance.save();

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addPeerFeedback = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: 'Performance review not found' });
        }

        performance.peerFeedbacks.push({
            ...req.body,
            reviewer: req.user._id
        });
        await performance.save();

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

