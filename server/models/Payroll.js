const mongoose = require('mongoose');

const taxSlabSchema = new mongoose.Schema({
    minIncome: { type: Number, required: true },
    maxIncome: { type: Number },
    rate: { type: Number, required: true }, // percentage
    fixedAmount: { type: Number, default: 0 }
});

const payrollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String, // e.g., "January"
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    // Earnings
    baseSalary: {
        type: Number,
        required: true,
    },
    allowances: {
        houseRent: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    bonuses: {
        performance: { type: Number, default: 0 },
        annual: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    overtime: { type: Number, default: 0 },
    grossSalary: { type: Number, required: true },
    
    // Deductions
    tax: {
        incomeTax: { type: Number, default: 0 },
        appliedSlab: taxSlabSchema,
        calculatedAt: Date
    },
    providentFund: { type: Number, default: 0 },
    healthInsurance: { type: Number, default: 0 },
    loanDeductions: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    
    // Net
    netSalary: {
        type: Number,
        required: true,
    },
    
    // Payslip
    payslipGenerated: { type: Boolean, default: false },
    payslipPath: String,
    payslipGeneratedAt: Date,
    
    // Status
    status: {
        type: String,
        enum: ['DRAFT', 'PROCESSED', 'PAID', 'CANCELLED'],
        default: 'DRAFT',
    },
    
    // Calculation metadata
    calculationDetails: {
        workingDays: Number,
        presentDays: Number,
        leaveDays: Number,
        unpaidLeaveDays: Number
    }
}, {
    timestamps: true,
});

// Indexes
payrollSchema.index({ user: 1, year: 1, month: 1 }, { unique: true });
payrollSchema.index({ status: 1, year: 1, month: 1 });

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
