const User = require('../models/usersModel');
const factory = require('./handeFactory');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIREIN
    });
};

const createSendToken = (user, res, statusCode)=>{
    const token = signToken(user.id);
    return res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    });
};

exports.captureErrors = factory.captureErrors('name', 'email', 'password', 'passwordConfirm');

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
    const verifyPassword = await user.correctPassword(password, user.password);
    
    if(!verifyPassword) return next(
        new AppError("Incorrect email or password", 400)
    );
    createSendToken(user, res, 200);
});

exports.protect = catchAsync(async(req, res, next)=>{
   let token;
    if(
       req.headers.authorization &&
       req.headers.authorization.startsWith('Bearer')
    ){ token = req.headers.authorization.split(' ')[1]; }

    if(!token)return next(
       new AppError("Your are logged in! Please log in to get access",401)
    );
    // decoded - GET ID
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // user search
    const user = await User.findByPk(decoded.id);
    if(!user) return next(
        new AppError("The user beloging to this user does no longer exists.", 401)
    );
    // verify password has modified changed recently  
     if(user.changedPasswordAfter(decoded.iat)) return next(
         new AppError('The password has been changed recently', 401)
    );
    req.user = user;
    res.locals.user = user;
    next();
});

exports.resetPassword = catchAsync(async(req, res, next)=>{
    const { password, newPassword, passwordConfirm } = req.body;
    if(
        password === "" || 
        newPassword === "" ||
        passwordConfirm === "" 
    ) return next(
        new AppError("write your password, new password and password Confirm", 400)
    );
    const user = await User.findByPk(req.user.id);
    // verify password
    if(!user) return next(
        new AppError("this user not exist", 4001)
    );
    const verifyPassword = await user.correctPassword(password, user.password);
    if(!verifyPassword) return next(
        new AppError("your password is invalid, Please revise your current password", 401)
    );
    if(newPassword !== passwordConfirm) return next(
        new AppError("new password and confirm password are not the same", 401)
    );
    user.password =  await bcryptjs.hash(newPassword, 12);
    user.passwordConfirm = "undefined";
    await user.save();
    createSendToken(user, res, 200);
});
