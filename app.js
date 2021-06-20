const express = require('express');

const helmet = require('helmet');
const path = require('path');

const AppError = require('./utils/appError');
const globalsErrors = require('./controllers/errorsController');

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');


const app = express();

// helmet - security HTTPS
app.use(helmet() );

// public assests - images/users
app.use("/assets", express.static(path.resolve(__dirname, "assets")))

// Read data in format JSON
app.use(express.json({ limit: '10kb' }) );
app.use(express.urlencoded({ extended: true }) );

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

// CAPTURE ERRORS GLOBALS
app.all('*', (req, res, next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalsErrors);

module.exports = app;