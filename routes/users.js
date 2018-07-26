const express = require('express');

const { addNewUser, userLogin, checkLoginState } = require('../controllers/usersController');
const auth = require('../helpers/auth');

const router = express.Router();

// POST
router.post('/register', addNewUser);
router.post('/login', userLogin);

// GET
router.get('/status', auth, checkLoginState);

module.exports = router;
