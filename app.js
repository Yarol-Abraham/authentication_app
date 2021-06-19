const express = require('express');

const helmet = require('helmet');

const authRouter = require('./routes/authRouter');


const app = express();

// helmet - security HTTPS
app.use(helmet() );

// Read data in format JSON
app.use(express.json({ limit: '10kb' }) );
app.use(express.urlencoded({ extended: true }) );

// CAPTURE ERRORS GLOBALS
app.all('*', (req, res, next)=>{
    console.log(req);
    console.log("init res");
    console.log(res);
});

//routes
app.use('/api/v1/user', authRouter);

//GET - errors

module.exports = app;