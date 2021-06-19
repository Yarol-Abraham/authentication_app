const User = require('../models/usersModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createAccount = catchAsync(async(req, res, next)=>{
    console.log("crear cuenta");
});
