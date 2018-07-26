const express = require('express');

const { addNewUser, userLogin } = require('../controllers/usersController');

const router = express.Router();

// POST
router.post('/register', addNewUser);
router.post('/login', userLogin);

module.exports = router;
