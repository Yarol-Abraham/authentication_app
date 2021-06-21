const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', 
   authController.captureErrors,
    authController.createAccount
);
router.post('/login', authController.login);
router.use(authController.protect);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;