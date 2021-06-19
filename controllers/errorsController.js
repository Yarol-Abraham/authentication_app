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


module.exports = function (err, res) {
    err.statusCode = err.statusCode || 500;
    err.message = err.status || 'error';

    if(process.env.NODE_EMVIRONMENT === 'development'){
        sendErrorDev(err, res);
    }
    
    else if(process.env.NODE_EMVIRONMENT === 'production'){
        let error = { ...err };
        error.message = err.message;
        sendErrorProd(error, res);
    }

}