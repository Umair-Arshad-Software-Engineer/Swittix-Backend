const path = require('path');
const { sequelize, ProjectRequest, ProjectRequestFile } = require('../models');

/**
 * Fields that arrive as JSON-encoded strings inside multipart/form-data
 * (arrays can't be sent as native arrays alongside files), so we parse
 * them back into real arrays before saving.
 */
function parseJsonArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// POST /api/project-requests
async function createProjectRequest(req, res) {
  const t = await sequelize.transaction();

  try {
    const {
      fullName,
      email,
      phone,
      company,
      projectType,
      platforms,
      budget,
      timeline,
      techPreferences,
      description,
      goals,
      hasExistingSystem,
      referenceLinks,
    } = req.body;

    // Basic required-field validation (mirrors the frontend's validate()).
    const errors = {};
    if (!fullName || !fullName.trim()) errors.fullName = 'Name is required';
    if (!email || !email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email';
    if (!projectType) errors.projectType = 'Select a project type';
    if (!description || !description.trim()) errors.description = 'Please describe your requirement';

    if (Object.keys(errors).length > 0) {
      await t.rollback();
      return res.status(422).json({ success: false, errors });
    }

    const projectRequest = await ProjectRequest.create(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone || null,
        company: company || null,
        projectType,
        platforms: parseJsonArrayField(platforms),
        budget: budget || null,
        timeline: timeline || null,
        techPreferences: parseJsonArrayField(techPreferences),
        description: description.trim(),
        goals: goals || null,
        hasExistingSystem: hasExistingSystem || null,
        referenceLinks: referenceLinks || null,
      },
      { transaction: t }
    );

    // req.files comes from multer (upload.array('files')) — empty array if
    // no files were attached.
    const files = req.files || [];
    if (files.length > 0) {
      const fileRecords = files.map((file) => ({
        projectRequestId: projectRequest.id,
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        relativePath: path.join('project-requests', file.filename),
      }));
      await ProjectRequestFile.bulkCreate(fileRecords, { transaction: t });
    }

    await t.commit();

    const result = await ProjectRequest.findByPk(projectRequest.id, {
      include: [{ model: ProjectRequestFile, as: 'files' }],
    });

    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    await t.rollback();
    console.error('createProjectRequest error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}

// GET /api/project-requests
async function listProjectRequests(req, res) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = status ? { status } : {};

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await ProjectRequest.findAndCountAll({
      where,
      include: [{ model: ProjectRequestFile, as: 'files' }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    console.error('listProjectRequests error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch project requests.' });
  }
}

// GET /api/project-requests/:id
async function getProjectRequest(req, res) {
  try {
    const record = await ProjectRequest.findByPk(req.params.id, {
      include: [{ model: ProjectRequestFile, as: 'files' }],
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Project request not found.' });
    }

    return res.json({ success: true, data: record });
  } catch (err) {
    console.error('getProjectRequest error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch project request.' });
  }
}

// PATCH /api/project-requests/:id/status
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ['new', 'reviewing', 'contacted', 'closed'];

    if (!allowed.includes(status)) {
      return res.status(422).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });
    }

    const record = await ProjectRequest.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Project request not found.' });
    }

    record.status = status;
    await record.save();

    return res.json({ success: true, data: record });
  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
}

module.exports = {
  createProjectRequest,
  listProjectRequests,
  getProjectRequest,
  updateStatus,
};
