const jwt = require('jsonwebtoken');

// Protects routes that only the admin dashboard should be able to hit.
// Expects: Authorization: Bearer <token>
function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    if (payload.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}

module.exports = requireAdminAuth;