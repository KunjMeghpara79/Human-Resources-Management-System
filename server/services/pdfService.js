const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePayslip = async (payroll, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `payslip_${user._id}_${payroll.month}_${payroll.year}.pdf`;
            const filePath = path.join(__dirname, '../uploads/payslips', fileName);

            // Ensure directory exists
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Header
            doc.fontSize(20).text('PAYSLIP', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Period: ${payroll.month} ${payroll.year}`, { align: 'center' });
            doc.moveDown(2);

            // Employee Information
            doc.fontSize(14).text('Employee Information', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11);
            doc.text(`Name: ${user.name}`);
            doc.text(`Employee ID: ${user._id}`);
            doc.text(`Email: ${user.email}`);
            doc.text(`Department: ${user.department || 'N/A'}`);
            doc.text(`Designation: ${user.jobTitle || 'N/A'}`);
            doc.moveDown();

            // Earnings
            doc.fontSize(14).text('Earnings', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11);
            doc.text(`Basic Salary: $${payroll.baseSalary.toFixed(2)}`);
            doc.text(`House Rent Allowance: $${payroll.allowances.houseRent.toFixed(2)}`);
            doc.text(`Transport Allowance: $${payroll.allowances.transport.toFixed(2)}`);
            doc.text(`Medical Allowance: $${payroll.allowances.medical.toFixed(2)}`);
            doc.text(`Other Allowances: $${payroll.allowances.other.toFixed(2)}`);
            doc.moveDown();
            doc.fontSize(12).text(`Gross Salary: $${payroll.grossSalary.toFixed(2)}`, { align: 'right' });
            doc.moveDown();

            // Deductions
            doc.fontSize(14).text('Deductions', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11);
            doc.text(`Income Tax: $${payroll.tax.incomeTax.toFixed(2)}`);
            doc.text(`Provident Fund: $${payroll.providentFund.toFixed(2)}`);
            doc.text(`Health Insurance: $${payroll.healthInsurance.toFixed(2)}`);
            doc.text(`Other Deductions: $${(payroll.totalDeductions - payroll.tax.incomeTax - payroll.providentFund - payroll.healthInsurance).toFixed(2)}`);
            doc.moveDown();
            doc.fontSize(12).text(`Total Deductions: $${payroll.totalDeductions.toFixed(2)}`, { align: 'right' });
            doc.moveDown(2);

            // Net Salary
            doc.fontSize(16).text(`Net Salary: $${payroll.netSalary.toFixed(2)}`, { align: 'right', underline: true });
            doc.moveDown(2);

            // Footer
            doc.fontSize(10).text('This is a computer-generated document and does not require a signature.', { align: 'center' });
            doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                resolve({ filePath, fileName });
            });

            stream.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generatePayslip
};

