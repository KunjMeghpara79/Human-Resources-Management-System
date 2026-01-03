const Queue = require('bull');
const { generatePayslip } = require('../services/pdfService');
const Payroll = require('../models/Payroll');
const User = require('../models/User');

// Create queues
const payslipQueue = new Queue('payslip generation', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
});

// Process payslip generation jobs
payslipQueue.process(async (job) => {
    const { payrollId } = job.data;
    
    try {
        const payroll = await Payroll.findById(payrollId).populate('user');
        if (!payroll) {
            throw new Error('Payroll not found');
        }

        const { filePath, fileName } = await generatePayslip(payroll, payroll.user);
        
        // Update payroll with payslip path
        payroll.payslipGenerated = true;
        payroll.payslipPath = filePath;
        payroll.payslipGeneratedAt = new Date();
        await payroll.save();

        return { filePath, fileName };
    } catch (error) {
        console.error('Payslip generation error:', error);
        throw error;
    }
});

// Email queue (for sending notifications)
const emailQueue = new Queue('email notifications', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
});

emailQueue.process(async (job) => {
    const { to, subject, body, type } = job.data;
    
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending email to ${to}: ${subject}`);
    
    // Simulate email sending
    return { success: true, messageId: `mock-${Date.now()}` };
});

module.exports = {
    payslipQueue,
    emailQueue
};

