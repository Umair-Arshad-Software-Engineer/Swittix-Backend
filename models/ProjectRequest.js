const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectRequest = sequelize.define(
  'ProjectRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ---- Contact details ----
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    // ---- Project scope ----
    projectType: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    // Stored as JSON array of strings, e.g. ["Web", "iOS"]
    platforms: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    budget: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    timeline: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    // Stored as JSON array of strings, e.g. ["Flutter", "Firebase"]
    techPreferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    // ---- Requirement details ----
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    goals: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hasExistingSystem: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    referenceLinks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ---- Internal tracking ----
    status: {
      type: DataTypes.ENUM('new', 'reviewing', 'contacted', 'closed'),
      allowNull: false,
      defaultValue: 'new',
    },
  },
  {
    tableName: 'project_requests',
  }
);

module.exports = ProjectRequest;
