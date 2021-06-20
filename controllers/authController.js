const User = require('../models/usersModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const jwt = require('jsonwebtoken');

const signToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIREIN
    });
}

const createSendToken = (user, res, statusCode)=>{
    const token = signToken(user.id);
   return res.status(statusCode).json({
       status: 'success',
       token,
       data: user
   })
}

exports.createAccount = catchAsync(async(req, res, next)=>{
    const user = await User.create(req.body);
    createSendToken(user, res, 200);
});

exports.login = catchAsync(async(req, res, next)=>{
    const { email, password } = req.body;
    if(email === "" || password === "" ) return next(
        new AppError("email and password cannot be empty", 400)
    );
    //user search
    const user = await User.findOne({
        where: { email }
    });
    if(!user) return next(
        new AppError("Incorrect email or password", 400)
    );
    //verify password
    const verifyPassword = await user.correctPassword(password);
    if(!verifyPassword) return next(
        new AppError("Incorrect email or password", 400)
    );
    createSendToken(user, res, 200);
});

exports.resetPassword = catchAsync(async(req, res, next)=>{

});

exports.protect = catchAsync(async(req, res, next)=>{

});