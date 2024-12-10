const express = require('express');
const { getMemberStats, getRoleDistribution, getRecentActivityLogs, getRecentActivityCounts } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/stats', getMemberStats);
router.get('/recent', getRecentActivityLogs);
router.get('/roles', getRoleDistribution);
router.get('/recent-activity-counts', getRecentActivityCounts);

module.exports = router;
