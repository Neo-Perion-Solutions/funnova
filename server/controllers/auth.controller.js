/**
 * auth.controller.js
 * Handles login/logout/me for admins and students (separate tables).
 * Auth uses login_id + password — NO email login.
 * JWT payload: { id, role, type (admin|student), grade }
 */

const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login - Check both admins and students tables
exports.login = async (req, res, next) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({ success: false, message: 'login_id and password are required' });
  }

  try {
    // First, try to find in admins table
    let result = await pool.query(
      'SELECT id, login_id, name, password_hash, role, email, avatar_url FROM admins WHERE login_id = $1',
      [login_id]
    );
    let user = result.rows[0];

    if (user) {
      // Admin found - verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid login ID or password' });
      }

      // Generate JWT for admin
      const payload = {
        id: user.id,
        role: user.role,
        type: 'admin',
        grade: null,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      });

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            login_id: user.login_id,
            name: user.name,
            role: user.role,
            email: user.email,
            avatar_url: user.avatar_url,
            type: 'admin',
          },
        },
      });
    }

    // If not in admins, try students table
    result = await pool.query(
      'SELECT id, login_id, name, password_hash, grade, section, avatar_url FROM students WHERE login_id = $1',
      [login_id]
    );
    user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login ID or password' });
    }

    // Student found - verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid login ID or password' });
    }

    // Generate JWT for student
    const payload = {
      id: user.id,
      role: 'student',
      type: 'student',
      grade: user.grade,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          login_id: user.login_id,
          name: user.name,
          role: 'student',
          grade: user.grade,
          section: user.section,
          avatar_url: user.avatar_url,
          type: 'student',
        },
      },
    });
  } catch (err) {
    console.error('🔴 AUTH ERROR:', err.message);
    console.error('Stack:', err.stack);
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me (requires authMw)
exports.getMe = async (req, res, next) => {
  try {
    const userType = req.user.type; // 'admin' or 'student'

    if (userType === 'admin') {
      // Get admin details
      const result = await pool.query(
        `SELECT id, login_id, name, role, email, avatar_url, created_at
         FROM admins WHERE id = $1`,
        [req.user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      return res.json({ success: true, data: { ...result.rows[0], type: 'admin' } });
    } else {
      // Get student details
      const result = await pool.query(
        `SELECT id, login_id, name, grade, section, avatar_url,
                lessons_completed, avg_score, streak_days, created_at
         FROM students WHERE id = $1`,
        [req.user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return res.json({ success: true, data: { ...result.rows[0], type: 'student' } });
    }
  } catch (err) {
    console.error('🔴 AUTH ERROR:', err.message);
    console.error('Stack:', err.stack);
    next(err);
  }
};
