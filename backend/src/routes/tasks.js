const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.get('/', auth, getTasks);
router.post('/', auth, admin, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, admin, deleteTask);

module.exports = router;
