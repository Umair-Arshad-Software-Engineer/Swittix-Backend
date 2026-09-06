const express = require('express');
const router = express.Router();

const requireAdminAuth = require('../middleware/requireAdminAuth');
const {
  createContactMessage,
  listContactMessages,
  updateContactMessageStatus,
} = require('../controllers/Contactmessagecontroller');

// Public: the Contact page's form submits here.
router.post('/', createContactMessage);

// Admin-only: viewing and managing submitted messages (used by /admin).
router.get('/', requireAdminAuth, listContactMessages);
router.patch('/:id/status', requireAdminAuth, updateContactMessageStatus);

module.exports = router;