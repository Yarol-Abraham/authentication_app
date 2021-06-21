const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { body, validationResult } = require('express-validator');

const filterData = (data, allowFields)=>{
    let newData = {};
    Object.keys(data).forEach(el =>{
        if( allowFields.includes(el) ) newData[el] = data[el];
    });
    return newData;
};

exports.captureErrors = (...options) => catchAsync(async(req, res, next)=>{
    let rules = [];
    let errors = "";
    // format data - req.body
    const filterBody = filterData(req.body, options);
    // revise if exists fields for create/update
    if(Object.keys(filterBody).length === 0) return next();
    // revise if the fields are empty 
    Object.keys(filterBody).forEach((field) =>{
        rules.push(
            body(field)
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage("cannot go empty")
        );
        if(body(field).builder.fields[0] === "email") 
        {   
            rules.push(
                body(field)
                .isEmail()
                .withMessage("your email is not valid")
            )
        }
        if(body(field).builder.fields[0] === "phone")
        { 
            rules.push(
                body(field)
                .isNumeric()
                .withMessage("Only numbers allowed")
            )
        }
    });
    await Promise.all( rules.map(validator => validator.run(req) ) );

    const errores = validationResult(req);
 
    if(!errores.isEmpty()){
        errores.array().forEach(err =>{
            errors += `${err.param} ${err.msg}. `;
        });
        return next(new AppError(errors, 400));
    }
    next();
});