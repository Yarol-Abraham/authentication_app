const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

route.use(authController.protect)
route
    .route('/getMe')
    .get(userController.getMe);

module.exports = route;