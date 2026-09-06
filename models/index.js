const sequelize = require('../config/database');
const ProjectRequest = require('./ProjectRequest');
const ProjectRequestFile = require('./ProjectRequestFile');
const Admin = require('./Admin');
const ContactMessage = require('./Contactmessage');

// One project request can have many attached files.
ProjectRequest.hasMany(ProjectRequestFile, {
  foreignKey: 'projectRequestId',
  as: 'files',
  onDelete: 'CASCADE',
});
ProjectRequestFile.belongsTo(ProjectRequest, {
  foreignKey: 'projectRequestId',
  as: 'projectRequest',
});

module.exports = {
  sequelize,
  ProjectRequest,
  ProjectRequestFile,
  Admin,
  ContactMessage,
};