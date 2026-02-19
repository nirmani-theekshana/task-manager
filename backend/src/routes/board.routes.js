const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getBoards, createBoard, deleteBoard } = require('../controllers/board.controller');
const router = express.Router();

router.get('/', protect, getBoards);
router.post('/', protect, createBoard);
router.delete('/:id', protect, deleteBoard);

module.exports = router;