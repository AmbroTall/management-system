const { Op } = require('sequelize');
const { Member, Role, ActivityLog, User } = require('../models');
const sequelize = require('../config/database');

const getMemberStats = async (req, res) => {
    try {
        const totalMembers = await Member.count();
        const roleCounts = await Member.findAll({
            attributes: ['role_id', [sequelize.fn('COUNT', sequelize.col('role_id')), 'count']],
            group: ['role_id'],
            include: {
                model: Role,
                attributes: ['name'], // Get the role name
            },
        });

        const roleStats = roleCounts.map((role) => ({
            role: role.Role.name,
            count: role.dataValues.count,
        }));

        res.json({
            totalMembers,
            roles: roleStats,
        });
    } catch (error) {
        console.error('Error fetching member stats:', error);
        res.status(500).json({ message: 'Failed to fetch member stats' });
    }
};


const getRecentActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            limit: 10, // Limit to 10 recent logs
            order: [['timestamp', 'DESC']], // Order by most recent first
            include: {
                model: User,
                attributes: ['username'], // Include the username of the user who performed the action
            },
        });

        const formattedLogs = logs.map((log) => ({
            timestamp: log.timestamp,
            action: log.action,
            performedBy: log.User.username,
        }));

        res.json(formattedLogs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Failed to fetch activity logs' });
    }
};

const getRoleDistribution = async (req, res) => {
    try {
        const roleCounts = await Member.findAll({
            attributes: ['role_id', [sequelize.fn('COUNT', sequelize.col('role_id')), 'count']],
            group: ['role_id'],
            include: {
                model: Role,
                attributes: ['name'], // Get the role name
            },
        });

        const distribution = roleCounts.map((role) => ({
            role: role.Role.name,
            count: role.dataValues.count,
        }));

        res.json(distribution);
    } catch (error) {
        console.error('Error fetching role distribution:', error);
        res.status(500).json({ message: 'Failed to fetch role distribution' });
    }
};

const getRecentActivityCounts = async (req, res) => {
    try {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        // Count newly added members
        const addedCount = await Member.count({
            where: {
                createdAt: {
                    [Op.between]: [yesterday, now],
                },
            },
        });

        // Count updated members
        const updatedCount = await Member.count({
            where: {
                updatedAt: {
                    [Op.between]: [yesterday, now],
                },
            },
        });

        // Count deleted members (requires paranoid mode)
        const deletedCount = await Member.count({
            where: {
                deletedAt: {
                    [Op.between]: [yesterday, now],
                },
            },
            paranoid: false, // Include soft-deleted rows
        });

        res.json({
            added: addedCount,
            updated: updatedCount,
            deleted: deletedCount,
        });
    } catch (error) {
        console.error('Error fetching recent activity counts:', error);
        res.status(500).json({ message: 'Failed to fetch recent activity counts' });
    }
};


module.exports = { getMemberStats, getRecentActivityLogs, getRoleDistribution, getRecentActivityCounts };
