const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');


router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

router.post('/request_password_reset', usersController.passwordResetRequest);

router.put('/reset_password/:signature', usersController.resetPassword);

module.exports = router;