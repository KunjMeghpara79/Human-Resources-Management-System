const AuditLog = require('../models/AuditLog');

const auditLog = (action, resource) => {
    return async (req, res, next) => {
        // Capture response after it's sent
        const originalSend = res.send;
        res.send = function(data) {
            res.send = originalSend;
            
            // Log the action asynchronously (don't block response)
            setImmediate(async () => {
                try {
                    const logData = {
                        user: req.user?._id || null,
                        action,
                        resource,
                        resourceId: req.params.id || req.body._id || null,
                        details: {
                            before: req.body.before || null,
                            after: req.body.after || null,
                            changes: req.body.changes || []
                        },
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.get('user-agent'),
                        status: res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILURE',
                        errorMessage: res.statusCode >= 400 ? data : null
                    };

                    await AuditLog.create(logData);
                } catch (error) {
                    console.error('Audit log error:', error);
                    // Don't fail the request if audit logging fails
                }
            });

            return originalSend.call(this, data);
        };

        next();
    };
};

module.exports = auditLog;

