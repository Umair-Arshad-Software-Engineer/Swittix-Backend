const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactMessage = sequelize.define(
  'ContactMessage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Internal tracking — mirrors ProjectRequest's status pattern so the
    // admin dashboard can manage both request types consistently.
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'closed'),
      allowNull: false,
      defaultValue: 'new',
    },
  },
  {
    tableName: 'contact_messages',
  }
);

module.exports = ContactMessage;