const Organization = require('../models/Organization');

exports.getHierarchy = async (req, res) => {
    try {
        const organizations = await Organization.find()
            .populate('parent', 'name')
            .populate('manager', 'name email')
            .populate('employees', 'name email jobTitle');

        res.json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id)
            .populate('parent', 'name')
            .populate('manager', 'name email')
            .populate('employees', 'name email jobTitle department');

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOrganization = async (req, res) => {
    try {
        const organization = new Organization(req.body);
        await organization.save();
        res.status(201).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

