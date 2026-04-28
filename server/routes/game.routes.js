const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const gameController = require('../controllers/game.controller');
const { body } = require('express-validator');

router.get('/', verifyToken, gameController.getGames);

router.post('/', [
  verifyAdmin,
  body('lesson_id').isInt(),
  body('title').notEmpty(),
  body('game_url').notEmpty()
], gameController.createGame);

// Save game score
router.post('/scores/save', verifyToken, gameController.saveGameScore);

router.put('/:id', verifyAdmin, gameController.updateGame);
router.delete('/:id', verifyAdmin, gameController.deleteGame);

module.exports = router;
