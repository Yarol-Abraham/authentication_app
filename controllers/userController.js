const User = require('../models/usersModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const sharp = require('sharp');


const sendJSON = (user, res, statusCode)=>{
    return res.status(statusCode).json({
        status: "success",
        data: user
    });
}

exports.getMe = catchAsync(async(req, res, next)=>{
    const user = await User.findByPk(req.user.id);
    if(!user) return next( 
        new AppError("this user not exist", 400) 
    );
    sendJSON(user, res, 200);
});

exports.uploadMe = catchAsync(async(req, res, next)=>{
    
});

exports.getUser = catchAsync(async(req, res, next)=>{

});

exports.getAllUsers = catchAsync(async()=>{

});