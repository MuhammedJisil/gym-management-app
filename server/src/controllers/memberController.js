
const { pool } = require('../config/database');
const { validateMemberData } = require('../utils/validator');
const { autoExpireMembers, formatMember } = require('../services/memberService');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/imageService');

const getMembers = async (req, res) => {
  try {
    await autoExpireMembers();
    
    const { search, status } = req.query;
    let query = 'SELECT * FROM members';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (status && status !== 'all') {
      conditions.push(`payment_status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    const members = result.rows.map(formatMember);

    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(formatMember(result.rows[0]));
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createMember = async (req, res) => {
  try {
    const validatedData = validateMemberData(req.body);
    let photoUrl = null;

    if (req.file) {
      try {
        photoUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ error: 'Failed to upload image' });
      }
    }

    const result = await pool.query(
      `INSERT INTO members (name, email, phone, membership_type, start_date, end_date, payment_status, photo_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        validatedData.name,
        validatedData.email,
        validatedData.phone,
        validatedData.membershipType,
        validatedData.startDate,
        validatedData.endDate,
        validatedData.paymentStatus,
        photoUrl
      ]
    );

    res.status(201).json(formatMember(result.rows[0]));
  } catch (err) {
    console.error('Error creating member:', err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else if (err.message.includes('required') || err.message.includes('Invalid')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = validateMemberData(req.body);
    
    const existingMember = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    if (existingMember.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let photoUrl = existingMember.rows[0].photo_url;
    
    if (req.file) {
      try {
        if (photoUrl) {
          await deleteFromCloudinary(photoUrl);
        }
        photoUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ error: 'Failed to upload image' });
      }
    }

    const result = await pool.query(
      `UPDATE members SET name = $1, email = $2, phone = $3, membership_type = $4, 
       start_date = $5, end_date = $6, payment_status = $7, photo_url = $8 
       WHERE id = $9 RETURNING *`,
      [
        validatedData.name,
        validatedData.email,
        validatedData.phone,
        validatedData.membershipType,
        validatedData.startDate,
        validatedData.endDate,
        validatedData.paymentStatus,
        photoUrl,
        id
      ]
    );

    res.json(formatMember(result.rows[0]));
  } catch (err) {
    console.error('Error updating member:', err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else if (err.message.includes('required') || err.message.includes('Invalid')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const memberResult = await pool.query('SELECT photo_url FROM members WHERE id = $1', [id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const photoUrl = memberResult.rows[0].photo_url;
    
    await pool.query('DELETE FROM members WHERE id = $1', [id]);
    
    if (photoUrl) {
      await deleteFromCloudinary(photoUrl);
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
};