const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ where: { email: String(email).trim().toLowerCase() } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'dev-secret-change-me',
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      data: {
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

// GET /api/auth/me — lets the frontend verify a stored token is still valid.
async function me(req, res) {
  return res.json({ success: true, data: req.admin });
}

module.exports = { login, me };