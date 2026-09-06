const { ContactMessage } = require('../models');

// POST /api/contact-messages
async function createContactMessage(req, res) {
  console.log('--- [createContactMessage] request received ---');
  console.log('Headers content-type:', req.headers['content-type']);
  console.log('Body:', req.body);

  try {
    const { fullName, phone, description } = req.body;

    const errors = {};
    if (!fullName || !fullName.trim()) errors.fullName = 'Name is required';
    if (!phone || !phone.trim()) errors.phone = 'Phone number is required';
    if (!description || !description.trim()) errors.description = 'Please add a short description';

    if (Object.keys(errors).length > 0) {
      console.log('Validation failed:', errors);
      return res.status(422).json({ success: false, errors });
    }

    console.log('Validation passed. Attempting ContactMessage.create()...');

    const message = await ContactMessage.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      description: description.trim(),
    });

    console.log('ContactMessage created successfully:', message.id);

    return res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error('createContactMessage error (full):', err);
    console.error('createContactMessage error name:', err.name);
    console.error('createContactMessage error message:', err.message);
    if (err.errors) {
      console.error('Sequelize validation errors:', err.errors.map(e => e.message));
    }
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}

// GET /api/contact-messages
async function listContactMessages(req, res) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = status ? { status } : {};

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await ContactMessage.findAndCountAll({
      where,
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
    console.error('listContactMessages error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
  }
}

// PATCH /api/contact-messages/:id/status
async function updateContactMessageStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'closed'];

    if (!allowed.includes(status)) {
      return res.status(422).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });
    }

    const record = await ContactMessage.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Contact message not found.' });
    }

    record.status = status;
    await record.save();

    return res.json({ success: true, data: record });
  } catch (err) {
    console.error('updateContactMessageStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
}

module.exports = {
  createContactMessage,
  listContactMessages,
  updateContactMessageStatus,
};