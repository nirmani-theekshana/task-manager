const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { createColumn, deleteColumn } = require('../controllers/column.controller');
const router = express.Router();

router.post('/', protect, createColumn);
router.delete('/:id', protect, deleteColumn);

module.exports = router;