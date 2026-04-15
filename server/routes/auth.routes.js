/**
 * routes/auth.routes.js
 *
 * Endpoints:
 *   POST /api/auth/login   — login with login_id + password
 *   POST /api/auth/logout  — stateless logout
 *   GET  /api/auth/me      — get current user from JWT
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMw = require('../middleware/authMw');

router.post('/login', authController.login);
router.post('/logout', authMw, authController.logout);
router.get('/me', authMw, authController.getMe);

module.exports = router;
