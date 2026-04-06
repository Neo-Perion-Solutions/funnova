const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.getGames = async (req, res, next) => {
  const { lesson_id } = req.query;
  try {
    let query = 'SELECT * FROM games';
    const params = [];
    if (lesson_id) {
      query += ' WHERE lesson_id = $1';
      params.push(lesson_id);
    }
    
    if (req.user.role !== 'admin') {
      if(params.length > 0) {
        query += ' AND is_hidden = false';
      } else {
        query += ' WHERE is_hidden = false';
      }
    }
    
    query += ' ORDER BY game_order';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.createGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { lesson_id, title, game_url, icon, is_hidden, game_order } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO games (lesson_id, title, game_url, icon, is_hidden, game_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [lesson_id, title, game_url, icon || '🎮', is_hidden || false, game_order || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateGame = async (req, res, next) => {
  const { title, game_url, icon, is_hidden, game_order } = req.body;
  try {
    const result = await db.query(
      `UPDATE games SET title = COALESCE($1, title), game_url = COALESCE($2, game_url),
       icon = COALESCE($3, icon), is_hidden = COALESCE($4, is_hidden), game_order = COALESCE($5, game_order)
       WHERE id = $6 RETURNING *`,
      [title, game_url, icon, is_hidden, game_order, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    await db.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    res.json({ message: 'Game deleted' });
  } catch (err) {
    next(err);
  }
};
