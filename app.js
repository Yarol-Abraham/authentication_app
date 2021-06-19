const express = require('express');

const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalsErrors = require('./controllers/errorsController');

const authRouter = require('./routes/authRouter');

const app = express();

// helmet - security HTTPS
app.use(helmet() );

// Read data in format JSON
app.use(express.json({ limit: '10kb' }) );
app.use(express.urlencoded({ extended: true }) );

//routes
app.use('/api/v1/user', authRouter);

// CAPTURE ERRORS GLOBALS
app.all('*', (req, res, next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalsErrors);

module.exports = app;