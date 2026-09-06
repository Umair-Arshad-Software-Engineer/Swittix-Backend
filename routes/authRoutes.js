const express = require('express');
const router = express.Router();

const { login, me } = require('../controllers/authController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

router.post('/login', login);
router.get('/me', requireAdminAuth, me);

module.exports = router;