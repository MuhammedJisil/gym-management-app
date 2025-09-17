const express = require('express');
const upload = require('../middleware/upload');
const memberController = require('../controllers/memberController');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Member routes
router.get('/members', memberController.getMembers);
router.get('/members/:id', memberController.getMember);
router.post('/members', upload.single('photo'), memberController.createMember);
router.put('/members/:id', upload.single('photo'), memberController.updateMember);
router.delete('/members/:id', memberController.deleteMember);

// Dashboard routes
router.get('/dashboard/stats', dashboardController.getStats);
router.get('/dashboard/expiring', dashboardController.getExpiringMembers);
router.post('/auto-expire', dashboardController.autoExpire);

module.exports = router;