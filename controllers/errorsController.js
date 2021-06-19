const AppError = require('../utils/appError');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

// ERRORS - DEVELOPMENT
function sendErrorDev(err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err
    });
};

// ERRORS - PRODUCTION
function sendErrorProd(err, res) {
    //error control isOperational
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    };
    //error no control
    return res.status(err.statusCode).json({
        status: err.status,
        message: "Something went wrong"
    })
}

module.exports = (err, req, res, next)=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENVIRONMENT === 'development'){
        sendErrorDev(err, res);
    }
    else if(process.env.NODE_ENVIRONMENT === 'production'){
        let error = { ...err };
        error.message = err.message;
        sendErrorProd(error, res);
    };
};