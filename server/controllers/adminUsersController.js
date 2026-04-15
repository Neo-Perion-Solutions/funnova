/**
 * adminUsersController.js
 * CRUD operations for managing admin users (main_admin can manage sub_admin and other admins)
 * Endpoints:
 *   GET    /api/admin/admin-users           — List all admins
 *   POST   /api/admin/admin-users           — Create new admin
 *   GET    /api/admin/admin-users/:id       — Get single admin
 *   PUT    /api/admin/admin-users/:id       — Update admin
 *   DELETE /api/admin/admin-users/:id       — Delete admin
 */

const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET /api/admin/admin-users — List all admins with optional search/filter
exports.getAdmins = async (req, res, next) => {
  try {
    const { search = '', role = '' } = req.query;

    let query = 'SELECT id, login_id, name, email, role, avatar_url, created_at FROM admins WHERE 1=1';
    const params = [];

    if (search) {
      query += ` AND (login_id ILIKE $${params.length + 1} OR name ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    if (role && role !== 'all') {
      query += ` AND role = $${params.length + 1}`;
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/admin-users/:id — Get single admin
exports.getAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, login_id, name, email, role, avatar_url, created_at FROM admins WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/admin-users — Create new admin
exports.createAdmin = async (req, res, next) => {
  try {
    const { login_id, name, email, password, role } = req.body;

    // Validate required fields
    if (!login_id || !name || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'login_id, name, password, and role are required',
      });
    }

    // Validate role
    if (!['main_admin', 'sub_admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'role must be main_admin or sub_admin',
      });
    }

    // Check if login_id already exists
    const existing = await pool.query(
      'SELECT id FROM admins WHERE login_id = $1',
      [login_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this login_id already exists',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin
    const result = await pool.query(
      `INSERT INTO admins (login_id, name, email, password_hash, role, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, login_id, name, email, role, avatar_url, created_at`,
      [login_id, name, email || null, passwordHash, role, '👨‍💼']
    );

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/admin-users/:id — Update admin
exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    // Get current admin
    const current = await pool.query(
      'SELECT * FROM admins WHERE id = $1',
      [id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }

    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }

    if (role !== undefined) {
      if (!['main_admin', 'sub_admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'role must be main_admin or sub_admin',
        });
      }
      updates.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }

    if (password !== undefined && password !== '') {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${paramIndex}`);
      values.push(passwordHash);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    // Add id to values
    values.push(id);
    const query = `UPDATE admins SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, login_id, name, email, role, avatar_url, created_at`;

    const result = await pool.query(query, values);

    return res.json({
      success: true,
      message: 'Admin updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/admin-users/:id — Delete admin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting the current user
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const result = await pool.query(
      'DELETE FROM admins WHERE id = $1 RETURNING id, login_id, name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.json({
      success: true,
      message: 'Admin deleted successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/impersonate/:studentId — Create impersonation token
// Only main_admin can impersonate students
exports.impersonateStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const adminId = req.user.id;

    // Verify admin is main_admin
    if (req.user.role !== 'main_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main_admin can impersonate students',
      });
    }

    // Get student details
    const studentResult = await pool.query(
      `SELECT id, login_id, name, grade, section, avatar_url, lessons_completed, avg_score, streak_days
       FROM students WHERE id = $1`,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const student = studentResult.rows[0];

    // Generate impersonation JWT token
    const payload = {
      id: adminId,
      role: req.user.role,
      type: 'admin',
      impersonatingStudentId: student.id,
      impersonatingStudentGrade: student.grade,
      impersonatingStudentName: student.name,
      isImpersonating: true,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return res.json({
      success: true,
      message: 'Impersonation token created successfully',
      data: {
        token,
        impersonatedStudent: {
          id: student.id,
          login_id: student.login_id,
          name: student.name,
          grade: student.grade,
          section: student.section,
          avatar_url: student.avatar_url,
          lessons_completed: student.lessons_completed,
          avg_score: student.avg_score,
          streak_days: student.streak_days,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
