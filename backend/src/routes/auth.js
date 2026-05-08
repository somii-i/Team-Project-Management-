const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { register, login, getMe, getUsers } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, admin, getUsers);

module.exports = router;
