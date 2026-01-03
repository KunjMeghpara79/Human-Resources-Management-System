const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'],
        default: 'PRESENT',
    },
    workingHours: {
        type: Number, // in hours
        default: 0,
    },
    // Biometric & Geo-fencing fields
    checkInLocation: {
        latitude: Number,
        longitude: Number,
        address: String,
        accuracy: Number // in meters
    },
    checkOutLocation: {
        latitude: Number,
        longitude: Number,
        address: String,
        accuracy: Number
    },
    biometricData: {
        method: {
            type: String,
            enum: ['FINGERPRINT', 'FACE', 'IRIS', 'VOICE', 'NONE'],
            default: 'NONE'
        },
        deviceId: String,
        verificationScore: Number
    },
    isWithinGeoFence: {
        type: Boolean,
        default: true
    },
    geoFenceDetails: {
        allowedRadius: Number, // in meters
        officeLocation: {
            latitude: Number,
            longitude: Number
        }
    },
    // Remote work tracking
    workMode: {
        type: String,
        enum: ['OFFICE', 'REMOTE', 'HYBRID'],
        default: 'OFFICE'
    },
    notes: String
}, {
    timestamps: true,
});

// Compound index to ensure one record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ 'checkInLocation.latitude': 1, 'checkInLocation.longitude': 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
