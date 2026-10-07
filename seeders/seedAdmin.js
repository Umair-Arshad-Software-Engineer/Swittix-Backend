require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('../models');

// Change these (or read from env) if you want different credentials.
const EMAIL = 'swittix@gmail.com';
const PASSWORD = 'Swittix753';

async function seedAdmin() {
  // Only ensures the `admins` table exists — does not touch other tables.
  await Admin.sync();

  const existing = await Admin.findOne({ where: { email: EMAIL } });
  if (existing) {
    console.log(`Admin "${EMAIL}" already exists (id=${existing.id}). Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const admin = await Admin.create({
    email: EMAIL,
    passwordHash,
    name: 'Swittix Admin',
  });

  console.log(`Admin created: ${admin.email} (id=${admin.id})`);
}

module.exports = seedAdmin;