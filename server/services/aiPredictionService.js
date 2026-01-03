const { LeavePrediction, AttritionPrediction } = require('../models/AIPrediction');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Simple ML-based prediction (in production, use TensorFlow.js or external ML service)
const predictLeave = async (employeeId) => {
    const employee = await User.findById(employeeId);
    if (!employee) throw new Error('Employee not found');

    // Get historical data
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const leaveHistory = await LeaveRequest.find({
        user: employeeId,
        createdAt: { $gte: lastYear }
    });

    const attendanceHistory = await Attendance.find({
        user: employeeId,
        date: { $gte: lastYear.toISOString().split('T')[0] }
    });

    // Calculate factors
    const totalLeaves = leaveHistory.length;
    const avgLeavesPerMonth = totalLeaves / 12;
    const attendanceRate = attendanceHistory.filter(a => a.status === 'PRESENT').length / attendanceHistory.length;

    // Simple prediction logic (replace with actual ML model)
    const factors = [
        { name: 'Historical Leave Pattern', weight: 0.4, impact: avgLeavesPerMonth > 2 ? 'POSITIVE' : 'NEGATIVE' },
        { name: 'Attendance Rate', weight: 0.3, impact: attendanceRate < 0.9 ? 'POSITIVE' : 'NEGATIVE' },
        { name: 'Seasonal Factor', weight: 0.2, impact: 'NEUTRAL' },
        { name: 'Recent Activity', weight: 0.1, impact: 'NEUTRAL' }
    ];

    // Calculate confidence score
    const confidence = Math.min(85, 50 + (avgLeavesPerMonth * 5) + ((1 - attendanceRate) * 20));

    // Predict next leave date (simplified - 30 days from now with some variance)
    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + 30 + Math.floor(Math.random() * 15));

    const prediction = new LeavePrediction({
        employee: employeeId,
        predictedDate,
        confidence: Math.round(confidence),
        leaveType: 'PAID',
        factors,
        modelVersion: '1.0'
    });

    await prediction.save();
    return prediction;
};

const predictAttrition = async (employeeId) => {
    const employee = await User.findById(employeeId);
    if (!employee) throw new Error('Employee not found');

    // Get employee data
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const leaveHistory = await LeaveRequest.find({
        user: employeeId,
        createdAt: { $gte: lastYear }
    });

    const attendanceHistory = await Attendance.find({
        user: employeeId,
        date: { $gte: lastYear.toISOString().split('T')[0] }
    });

    // Calculate risk factors
    const attendanceRate = attendanceHistory.length > 0 
        ? attendanceHistory.filter(a => a.status === 'PRESENT').length / attendanceHistory.length 
        : 1;

    const leaveFrequency = leaveHistory.length;
    const recentLeaveRequests = leaveHistory.filter(l => {
        const daysSince = (new Date() - new Date(l.createdAt)) / (1000 * 60 * 60 * 24);
        return daysSince < 90;
    }).length;

    // Calculate risk score (0-100)
    let riskScore = 0;
    const factors = [];

    // Attendance factor
    if (attendanceRate < 0.85) {
        riskScore += 30;
        factors.push({ name: 'Low Attendance', weight: 0.3, impact: 'NEGATIVE' });
    }

    // Leave frequency factor
    if (leaveFrequency > 10) {
        riskScore += 25;
        factors.push({ name: 'High Leave Frequency', weight: 0.25, impact: 'NEGATIVE' });
    }

    // Recent leave requests
    if (recentLeaveRequests > 3) {
        riskScore += 20;
        factors.push({ name: 'Recent Leave Requests', weight: 0.2, impact: 'NEGATIVE' });
    }

    // Tenure factor (simplified)
    const joiningDate = employee.joiningDate || new Date();
    const tenureMonths = (new Date() - joiningDate) / (1000 * 60 * 60 * 24 * 30);
    if (tenureMonths < 6) {
        riskScore += 15;
        factors.push({ name: 'Short Tenure', weight: 0.15, impact: 'NEGATIVE' });
    }

    // Determine risk level
    let riskLevel = 'LOW';
    if (riskScore >= 70) riskLevel = 'CRITICAL';
    else if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 30) riskLevel = 'MEDIUM';

    // Generate recommendations
    const recommendations = [];
    if (attendanceRate < 0.85) {
        recommendations.push('Address attendance concerns with employee');
    }
    if (leaveFrequency > 10) {
        recommendations.push('Review leave patterns and workload');
    }
    if (riskScore >= 50) {
        recommendations.push('Schedule retention discussion');
        recommendations.push('Consider employee engagement initiatives');
    }

    const prediction = await AttritionPrediction.findOneAndUpdate(
        { employee: employeeId },
        {
            riskScore: Math.min(100, riskScore),
            riskLevel,
            factors,
            recommendations,
            modelVersion: '1.0',
            lastUpdated: new Date()
        },
        { upsert: true, new: true }
    );

    return prediction;
};

module.exports = {
    predictLeave,
    predictAttrition
};

