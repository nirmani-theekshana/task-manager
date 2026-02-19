const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const router = express.Router();

router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;