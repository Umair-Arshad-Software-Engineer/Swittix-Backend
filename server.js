require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { sequelize } = require('./models');
const projectRequestRoutes = require('./routes/projectRequestRoutes');
const authRoutes = require('./routes/authRoutes');
const contactMessageRoutes = require('./routes/Contactmessageroutes');
const seedAdmin = require('./seeders/seedAdmin'); // <-- import the seed function

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Routes ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/project-requests', projectRequestRoutes);
app.use('/api/contact-messages', contactMessageRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ---- Global error handler ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ---- Start server after DB connection is verified ----
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synced.');

    // Seed default admin if it doesn't already exist (runs every startup)
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Swittix backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();