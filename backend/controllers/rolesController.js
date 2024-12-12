const express = require('express');
const authenticate = require('../middleware/auth');
const { User, Role, ActivityLog } = require('../models'); // Import models

const router = express.Router();

// Create role
router.post('/', authenticate, async (req, res) => {
    const { name, description } = req.body;
    try {
        // Get the authenticated user's ID
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create a new 
        const role = await Role.create({
            name,
            description,
            created_by: user.id, // Set the creator as the current user
        });
         // Log the activity
        await ActivityLog.create({
            action: 'Created Role',
            timestamp: new Date(),
            member_id: role.id,
            user_id: user.id,
        });

        res.status(201).json(role);
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Error creating role', error });
    }
});

// Get all roles with pagination
router.get('/', authenticate, async (req, res) => {
    try {
        // Extract pagination parameters from the query string
        const { page = 1, limit = 10 } = req.query;

        // Calculate offset based on page and limit
        const offset = (page - 1) * limit;

        // Fetch roles with pagination
        const { count, rows: roles } = await Role.findAndCountAll({
            offset: parseInt(offset), // Skip the first "offset" records
            limit: parseInt(limit),  // Limit the number of records returned
        });

        // Return paginated results
        res.json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalRecords: count,
            roles,
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Error fetching roles', error });
    }
});


// Get a specific role by ID
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findByPk(id, {
  
        });

        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ message: 'Error fetching role', error });
    }
});

// Update role
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const role = await Role.findByPk(id);

        if (!role) return res.status(404).json({ message: 'Role not found' });

        // // Ensure the user has permission to update the role
        // if (role.created_by !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        // Update fields
        role.name = name || role.name;
        role.description = description || role.email;

        await role.save();
        // Log the activity
        await ActivityLog.create({
            action: 'Updated Role',
            timestamp: new Date(),
            member_id: role.id,
            user_id: req.user.id,
        });

        res.json(role);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Error updating role', error });
    }
});

// Delete member
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findByPk(id);

        if (!role) return res.status(404).json({ message: 'Role not found' });

        // // Ensure the user has permission to delete the role
        // if (role.created_by !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await role.destroy();
        // Log the activity
        await ActivityLog.create({
            action: 'Deleted Role',
            timestamp: new Date(),
            role_id: role.id,
            user_id: req.user.id,
        });

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Error deleting role', error });
    }
});

module.exports = router;
