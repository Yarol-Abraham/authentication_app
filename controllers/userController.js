const User = require('../models/usersModel');
const factory = require('./handeFactory');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const sharp = require('sharp');
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
    req.file.filename = `${req.user.id}-${Date.now()}.jpeg`;
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
    const data = user;
    let message = "ok";
    if( req.url === "/uploadMe" ) message = "Your data update success";
    return res.status(statusCode).json({
        status: "success",
        data,
        message
    });
};

exports.getMe = catchAsync(async(req, res, next)=>{
    const user = await User.findByPk(req.user.id);
    if(!user) return next( 
        new AppError("this user not exist", 400) 
    );
    user.password = undefined;
    user.passwordConfirm = undefined;
    sendJSON(user, req, res, 200);
});

exports.captureErrors = factory.captureErrors('photoURL', 'name', 'bio', 'phone', 'email');

exports.uploadMe = catchAsync(async(req, res, next)=>{
    if(req.body.password || req.body.passwordConfirm) return next(
        new AppError("This route is not for password updates. Please use /updatePassword", 400)
    );
    // if exist image
    if(req.file) req.body.photo = req.file.filename;
    // if exist fields in req.body
    if(Object.keys(req.body) === 0) return sendJSON(null, req, res, 200);
    // update user
    await User.update(req.body, {
        where: { id: req.user.id }
    });
    const user = await User.findByPk(req.user.id);
    sendJSON(user, req, res, 200);
});

exports.getUser = catchAsync(async(req, res, next)=>{
    const user = await User.findByPk(req.params.id);
    if(!user) return next(
        new AppError("Sorry, not we find the user", 404)
    );
    sendJSON(user, req, res, 200);
});
