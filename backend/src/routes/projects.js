const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

router.get('/', auth, getProjects);
router.post('/', auth, admin, createProject);
router.put('/:id', auth, admin, updateProject);
router.delete('/:id', auth, admin, deleteProject);

module.exports = router;
