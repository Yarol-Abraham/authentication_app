const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

route.use(authController.protect)
route.get('/getMe',userController.getMe);
route.patch('/uploadMe', 
   userController.updateUserPhoto,
   userController.captureErrors,
   userController.resizePhoto,
   userController.uploadMe
);
module.exports = route;