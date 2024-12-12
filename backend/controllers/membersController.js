const express = require('express');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload'); // Multer middleware for file uploads
const { Member, User, Role, ActivityLog } = require('../models'); // Import models

const router = express.Router();

// Create member
router.post('/', authenticate, upload.single('profile_picture'), async (req, res) => {
    const { name, email, date_of_birth, role_id } = req.body;
    const profile_picture = req.file ? req.file.path : null; // Save uploaded image path

    try {
        // Check if role_id exists
        const role = await Role.findByPk(parseInt(role_id));
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // Get the authenticated user's ID
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create a new member
        const member = await Member.create({
            name,
            email,
            date_of_birth,
            profile_picture,
            role_id : role.id,
            created_by: user.id, // Set the creator as the current user
        });
        console.log("first", user)
         // Log the activity
        await ActivityLog.create({
            action: 'Created Member',
            timestamp: new Date(),
            member_id: member.id,
            user_id: user.id,
        });

        res.status(201).json(member);
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({ message: 'Error creating member', error });
    }
});

// Get all members with pagination
router.get('/', authenticate, async (req, res) => {
    try {
        // Extract pagination parameters from the query string
        const { page = 1, limit = 10 } = req.query;

        // Calculate offset based on page and limit
        const offset = (page - 1) * limit;

        // Fetch members with pagination
        const { count, rows: members } = await Member.findAndCountAll({
            offset: parseInt(offset), // Skip the first "offset" records
            // limit: parseInt(limit),  // Limit the number of records returned
            include: [
                {
                    model: User,
                    as: 'creator', // Must match the alias in the association
                    attributes: ['username', 'email'],
                },
                {
                    model: Role,
                    attributes: ['name'],
                },
            ],
        });

        // Return paginated results
        res.json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalRecords: count,
            members,
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Error fetching members', error });
    }
});


// Get a specific member by ID
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const member = await Member.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username', 'email'],
                },
                {
                    model: Role,
                    attributes: ['name'], // Include role name
                },
            ],
        });

        if (!member) return res.status(404).json({ message: 'Member not found' });

        res.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ message: 'Error fetching member', error });
    }
});

// Update member
router.put('/:id', authenticate, upload.single('profile_picture'), async (req, res) => {
    const { id } = req.params;
    const { name, email, date_of_birth, role_id } = req.body;
    const profile_picture = req.file ? req.file.path : null;

    try {
        const member = await Member.findByPk(id);

        if (!member) return res.status(404).json({ message: 'Member not found' });

        // // Ensure the user has permission to update the member
        // if (member.created_by !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        // Update fields
        member.name = name || member.name;
        member.email = email || member.email;
        member.date_of_birth = date_of_birth || member.date_of_birth;
        member.profile_picture = profile_picture || member.profile_picture;
        member.role_id = role_id || member.role_id;

        await member.save();
        // Log the activity
        await ActivityLog.create({
            action: 'Updated Member',
            timestamp: new Date(),
            member_id: member.id,
            user_id: req.user.id,
        });

        res.json(member);
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ message: 'Error updating member', error });
    }
});

// Delete member
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const member = await Member.findByPk(id);

        if (!member) return res.status(404).json({ message: 'Member not found' });

        // // Ensure the user has permission to delete the member
        // if (member.created_by !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await member.destroy();
        // Log the activity
        await ActivityLog.create({
            action: 'Deleted Member',
            timestamp: new Date(),
            member_id: member.id,
            user_id: req.user.id,
        });

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ message: 'Error deleting member', error });
    }
});

module.exports = router;
