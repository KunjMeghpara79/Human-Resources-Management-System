const permissions = {
    ADMIN: [
        'users:create', 'users:read', 'users:update', 'users:delete',
        'attendance:read', 'attendance:update', 'attendance:delete',
        'leave:read', 'leave:approve', 'leave:reject', 'leave:delete',
        'payroll:create', 'payroll:read', 'payroll:update', 'payroll:delete',
        'performance:create', 'performance:read', 'performance:update', 'performance:delete',
        'organization:create', 'organization:read', 'organization:update',
        'documents:create', 'documents:read', 'documents:update', 'documents:delete',
        'predictions:create', 'predictions:read',
        'audit:read',
        'reports:read', 'reports:export', 'settings:update'
    ],
    HR: [
        'users:create', 'users:read', 'users:update',
        'attendance:read', 'attendance:update',
        'leave:read', 'leave:approve', 'leave:reject',
        'payroll:read', 'payroll:update',
        'performance:create', 'performance:read', 'performance:update',
        'organization:read',
        'documents:read', 'documents:update',
        'predictions:read',
        'reports:read', 'reports:export'
    ],
    EMPLOYEE: [
        'users:read:own', 'users:update:own',
        'attendance:create:own', 'attendance:read:own',
        'leave:create:own', 'leave:read:own',
        'payroll:read:own',
        'performance:read:own', 'performance:update:own'
    ]
};

const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userRole = req.user.role;
        const userPermissions = permissions[userRole] || [];

        // Check if user has the required permission
        const hasPermission = userPermissions.some(perm => {
            // Exact match
            if (perm === requiredPermission) return true;
            
            // Check for "own" resource access
            if (requiredPermission.includes(':own')) {
                const basePermission = requiredPermission.replace(':own', '');
                return userPermissions.includes(basePermission) || 
                       userPermissions.includes(requiredPermission);
            }
            
            // Check if admin/HR has broader permission
            if (userRole === 'ADMIN' || userRole === 'HR') {
                const baseAction = requiredPermission.split(':')[0];
                return userPermissions.some(p => p.startsWith(baseAction));
            }
            
            return false;
        });

        // Additional check for "own" resources
        if (requiredPermission.includes(':own')) {
            const resourceId = req.params.id || req.body.user || req.user._id;
            if (resourceId && resourceId.toString() === req.user._id.toString()) {
                return next();
            }
        }

        if (!hasPermission) {
            return res.status(403).json({ 
                message: 'Forbidden: Insufficient permissions',
                required: requiredPermission,
                userRole: userRole
            });
        }

        next();
    };
};

module.exports = {
    checkPermission,
    permissions
};

