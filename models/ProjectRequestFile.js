const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectRequestFile = sequelize.define(
  'ProjectRequestFile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Filename as stored on disk (unique, sanitized)
    storedName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    sizeBytes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Relative path from the uploads/ folder, used to build a download URL
    relativePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    tableName: 'project_request_files',
  }
);

module.exports = ProjectRequestFile;
