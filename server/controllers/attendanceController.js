const Attendance = require('../models/Attendance');
const { cacheGet, cacheSet, cacheDelete } = require('../config/redis');

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Check-in with geo-fencing
exports.checkIn = async (req, res) => {
    try {
        const { latitude, longitude, biometricData, workMode } = req.body;
        const userId = req.user._id;
        const today = new Date().toISOString().split('T')[0];

        // Check if already checked in today
        const existing = await Attendance.findOne({ user: userId, date: today });
        if (existing && existing.checkIn) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        // Geo-fencing check (if office location is configured)
        const officeLocation = {
            latitude: parseFloat(process.env.OFFICE_LAT || '0'),
            longitude: parseFloat(process.env.OFFICE_LONG || '0')
        };
        const allowedRadius = parseFloat(process.env.GEOFENCE_RADIUS || '100'); // meters

        let isWithinGeoFence = true;
        if (officeLocation.latitude !== 0 && officeLocation.longitude !== 0 && latitude && longitude) {
            try {
                const distance = calculateDistance(
                    parseFloat(latitude) || 0, 
                    parseFloat(longitude) || 0,
                    officeLocation.latitude, 
                    officeLocation.longitude
                );
                isWithinGeoFence = distance <= allowedRadius;
            } catch (geoError) {
                console.error('Geo-fencing calculation error:', geoError);
                // Continue with check-in even if geo-fencing calculation fails
                isWithinGeoFence = true;
            }
        }

        const attendance = await Attendance.findOneAndUpdate(
            { user: userId, date: today },
            {
                user: userId,
                date: today,
                checkIn: new Date(),
                checkInLocation: latitude && longitude ? {
                    latitude: parseFloat(latitude) || 0,
                    longitude: parseFloat(longitude) || 0,
                    accuracy: req.body.accuracy || 0
                } : undefined,
                biometricData: biometricData || { method: 'NONE' },
                isWithinGeoFence,
                geoFenceDetails: {
                    allowedRadius,
                    officeLocation
                },
                workMode: workMode || 'OFFICE',
                status: 'PRESENT'
            },
            { upsert: true, new: true }
        );

        // Ensure attendance was created/updated
        if (!attendance) {
            return res.status(500).json({ message: 'Failed to create attendance record' });
        }

        console.log(`Check-in successful for user ${userId} on ${today}. Attendance ID: ${attendance._id}`);

        // Invalidate cache (don't fail if cache fails)
        try {
            await cacheDelete(`attendance:${userId}:${today}`);
        } catch (cacheError) {
            console.error('Cache delete error:', cacheError);
            // Continue even if cache fails
        }

        // Emit real-time notification
        try {
            const io = req.app.get('io');
            if (io) {
                io.to(`user-${userId}`).emit('attendance-update', {
                    type: 'check-in',
                    attendance
                });
            }
        } catch (ioError) {
            console.error('Socket.io error:', ioError);
            // Continue even if socket fails
        }

        // Return the attendance object with all fields
        res.status(201).json(attendance);
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Check-out
exports.checkOut = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const userId = req.user._id;
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({ user: userId, date: today });
        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({ message: 'No check-in found for today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        const checkOutTime = new Date();
        const workingHours = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60); // hours

        attendance.checkOut = checkOutTime;
        attendance.checkOutLocation = {
            latitude,
            longitude,
            accuracy: req.body.accuracy || 0
        };
        attendance.workingHours = Math.round(workingHours * 100) / 100;
        await attendance.save();

        // Invalidate cache (don't fail if cache fails)
        try {
            await cacheDelete(`attendance:${userId}:${today}`);
        } catch (cacheError) {
            console.error('Cache delete error:', cacheError);
            // Continue even if cache fails
        }

        // Emit real-time notification
        try {
            const io = req.app.get('io');
            if (io) {
                io.to(`user-${userId}`).emit('attendance-update', {
                    type: 'check-out',
                    attendance
                });
            }
        } catch (ioError) {
            console.error('Socket.io error:', ioError);
            // Continue even if socket fails
        }

        res.json(attendance);
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Get attendance with caching
exports.getAttendance = async (req, res) => {
    try {
        const userId = req.user._id;
        const { date, month, year } = req.query;

        let cacheKey;
        let attendance;

        if (date) {
            try {
                cacheKey = `attendance:${userId}:${date}`;
                attendance = await cacheGet(cacheKey);
                if (attendance) {
                    console.log(`Found attendance in cache for user ${userId} on ${date}`);
                }
            } catch (cacheError) {
                console.error('Cache get error:', cacheError);
                attendance = null; // Continue without cache
            }
            
            if (!attendance) {
                attendance = await Attendance.findOne({ user: userId, date });
                console.log(`Fetching attendance for user ${userId} on ${date}:`, attendance ? `Found (ID: ${attendance._id}, checkIn: ${attendance.checkIn})` : 'Not found');
                if (attendance && cacheKey) {
                    try {
                        await cacheSet(cacheKey, attendance, 3600);
                    } catch (cacheError) {
                        console.error('Cache set error:', cacheError);
                        // Continue even if cache fails
                    }
                }
            }
            
            // Return as array to match the expected format
            res.json(attendance ? [attendance] : []);
            return;
        } else if (month && year) {
            try {
                cacheKey = `attendance:${userId}:${month}:${year}`;
                attendance = await cacheGet(cacheKey);
            } catch (cacheError) {
                console.error('Cache get error:', cacheError);
                attendance = null;
            }
            
            if (!attendance) {
                attendance = await Attendance.find({
                    user: userId,
                    date: { $regex: `${year}-${String(month).padStart(2, '0')}` }
                });
                if (attendance && cacheKey) {
                    try {
                        await cacheSet(cacheKey, attendance, 3600);
                    } catch (cacheError) {
                        console.error('Cache set error:', cacheError);
                        // Continue even if cache fails
                    }
                }
            }
        } else {
            attendance = await Attendance.find({ user: userId })
                .sort({ date: -1 })
                .limit(30);
        }

        res.json(attendance || []);
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Get all attendance (admin)
exports.getAllAttendance = async (req, res) => {
    try {
        const { date, userId } = req.query;
        const query = {};

        if (date) query.date = date;
        if (userId) query.user = userId;

        const attendance = await Attendance.find(query)
            .populate('user', 'name email')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
