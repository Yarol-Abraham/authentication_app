const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.route('/account').post(userController.createAccount);

module.exports = route;