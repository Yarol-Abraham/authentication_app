const User = require('../models/usersModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const sharp = require('sharp');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new AppError("Not an image! Please upload only image", 400), false)
    };
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.updateUserPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async(req, res, next)=>{
  
    if(!req.file) return next();
    req.file.filename = `${req.user.id}-${req.user.email}.jpeg`;
    // delete previous image
   if(req.user.photo !== 'default.jpg'){
        const previousImagen = __dirname+`/../assets/images/users/${req.file.filename}`;
        fs.unlink(previousImagen, (error)=>{
            if(error){
                return next(
                    new AppError("An error occurred while trying to upload the image. Please try again", 400)
                ); 
            };
        });
   };
   // save image
    await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`assets/images/users/${req.file.filename}`);
    next();
});

const sendJSON = (user, req, res, statusCode)=>{
    let data = user;
    if(
        req.url === "/uploadMe" && data === null || 
        req.url === "/uploadMe" && Array.isArray(data)
    ) data = "Your data update success";
    return res.status(statusCode).json({
        status: "success",
        data
    });
};

const filterData = (data, ...allowFields)=>{
    let newData = {};
    Object.keys(data).forEach(el =>{
        if( allowFields.includes(el) ) newData[el] = data[el];
    });
    return newData;
};

exports.getMe = catchAsync(async(req, res, next)=>{
    const user = await User.findByPk(req.user.id);
    if(!user) return next( 
        new AppError("this user not exist", 400) 
    );
    sendJSON(user, req, res, 200);
});

exports.captureErrors = catchAsync(async(req, res, next)=>{
    let rules = [];
    // filter data in req.body
    const filterBody = filterData(req.body, 'photoURL', 'name', 'bio', 'phone', 'email');
    // revise if exists fields for update
    if(Object.keys(filterBody).length === 0) return sendJSON(null, req, res, 200);
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
        //TODO: terminar esta parte
        console.log(errores.array());
    }

   // next();
});

exports.uploadMe = catchAsync(async(req, res, next)=>{
    if(req.body.password || req.body.passwordConfirm) return next(
        new AppError("This route is not for password updates. Please use /updatePassword", 400)
    );
    // if exist image
    if(req.file) req.body.photo = req.file.filename;
    // update user
    const user = await User.update(req.body, {
        where: { id: req.user.id }
    });
    sendJSON(user, req, res, 200);
});

exports.getUser = catchAsync(async(req, res, next)=>{
    const user = await User.findByPk(req.params.id);
    if(!user) return next(
        new AppError("Sorry, not we find the user", 404)
    );
    sendJSON(user, req, res, 200);
});
