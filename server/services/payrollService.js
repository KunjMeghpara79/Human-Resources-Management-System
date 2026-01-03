const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Tax slabs configuration (example - adjust based on your country)
const TAX_SLABS = [
    { minIncome: 0, maxIncome: 250000, rate: 0, fixedAmount: 0 },
    { minIncome: 250000, maxIncome: 500000, rate: 5, fixedAmount: 0 },
    { minIncome: 500000, maxIncome: 1000000, rate: 20, fixedAmount: 12500 },
    { minIncome: 1000000, maxIncome: null, rate: 30, fixedAmount: 112500 }
];

const calculateTax = (annualIncome) => {
    let tax = 0;
    let appliedSlab = null;

    for (let i = TAX_SLABS.length - 1; i >= 0; i--) {
        const slab = TAX_SLABS[i];
        if (annualIncome > slab.minIncome) {
            const taxableAmount = slab.maxIncome 
                ? Math.min(annualIncome - slab.minIncome, slab.maxIncome - slab.minIncome)
                : annualIncome - slab.minIncome;
            
            tax = slab.fixedAmount + (taxableAmount * slab.rate / 100);
            appliedSlab = { ...slab };
            break;
        }
    }

    return { tax, appliedSlab };
};

const calculateMonthlyTax = (monthlyIncome) => {
    const annualIncome = monthlyIncome * 12;
    const { tax, appliedSlab } = calculateTax(annualIncome);
    return { monthlyTax: tax / 12, appliedSlab };
};

const calculatePayroll = async (userId, month, year) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Get base salary (assuming it's stored in user model or payroll config)
    const baseSalary = user.baseSalary || 50000; // Default fallback

    // Calculate working days
    const startDate = new Date(year, getMonthIndex(month), 1);
    const endDate = new Date(year, getMonthIndex(month) + 1, 0);
    const totalDays = endDate.getDate();
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({
        user: userId,
        date: {
            $gte: formatDate(startDate),
            $lte: formatDate(endDate)
        }
    });

    const presentDays = attendanceRecords.filter(a => a.status === 'PRESENT').length;
    const leaveDays = attendanceRecords.filter(a => a.status === 'LEAVE').length;
    const workingDays = presentDays + leaveDays;

    // Calculate allowances (example percentages)
    const allowances = {
        houseRent: baseSalary * 0.2,
        transport: baseSalary * 0.1,
        medical: baseSalary * 0.05,
        other: 0
    };

    // Calculate gross salary
    const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + val, 0);
    const grossSalary = baseSalary + totalAllowances;

    // Calculate tax
    const { monthlyTax, appliedSlab } = calculateMonthlyTax(grossSalary);

    // Calculate deductions
    const providentFund = grossSalary * 0.12; // 12% of gross
    const healthInsurance = 2000; // Fixed amount
    const totalDeductions = monthlyTax + providentFund + healthInsurance;

    // Calculate net salary
    const netSalary = grossSalary - totalDeductions;

    // Create or update payroll record
    const payroll = await Payroll.findOneAndUpdate(
        { user: userId, month, year },
        {
            baseSalary,
            allowances,
            grossSalary,
            tax: {
                incomeTax: monthlyTax,
                appliedSlab,
                calculatedAt: new Date()
            },
            providentFund,
            healthInsurance,
            totalDeductions,
            netSalary,
            calculationDetails: {
                workingDays: totalDays,
                presentDays,
                leaveDays,
                unpaidLeaveDays: 0
            },
            status: 'PROCESSED'
        },
        { upsert: true, new: true }
    );

    return payroll;
};

const getMonthIndex = (monthName) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(monthName);
};

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

module.exports = {
    calculatePayroll,
    calculateTax,
    calculateMonthlyTax,
    TAX_SLABS
};

