const express = require('express');
const router = express.Router();

const { upload } = require('../config/upload');
const handleUploadErrors = require('../middleware/handleUploadErrors');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const {
  createProjectRequest,
  listProjectRequests,
  getProjectRequest,
  updateStatus,
} = require('../controllers/projectRequestController');

// Public: the "Start a Project" form on the site submits here.
router.post('/', handleUploadErrors(upload.array('files', 10)), createProjectRequest);

// Admin-only: viewing and managing submitted requests (used by /admin).
router.get('/', requireAdminAuth, listProjectRequests);
router.get('/:id', requireAdminAuth, getProjectRequest);
router.patch('/:id/status', requireAdminAuth, updateStatus);

module.exports = router;