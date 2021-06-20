const { DataTypes } = require('sequelize');
const db = require('../config/db');
const appError = require('../utils/appError');
const bcryptjs = require('bcryptjs');

const User = db.define('Users', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Please tell us your name"
            }
        }
    },

    bio: DataTypes.TEXT,

    phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull: { 
                msg: "Please provide your phone"
            },
            isNumeric: {
                args: true,
                msg: "Only numbers allowed"
            }
        }
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        trim: true,
        unique: true,
        validate: {
            notNull: { 
                msg: "Please provide your email"
            },
            isEmail: {
                args: true,
                msg: "your email is not valid"
            }
        }
    },
    
    photo: {
        type: DataTypes.STRING,
        defaultValue: "default.jpg"
    },  

    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide your password"
            }
        }
    },
    passwordConfirm: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please confirm your password"
            },
            validatePassword(value) {
                if (value === null || this.password !== value) {
                  throw new appError("Passwords are not the same", 400);
                }
            }
        }
    },
    
    passwordChangeAt:{
        type:  DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

} );

//hash password
User.addHook('beforeCreate', async function(user) {
    const hashPassword = await bcryptjs.hashSync(user.password, 12);
    user.password = hashPassword;
    user.passwordConfirm = "undefined";
});

//update passwordChangedAt
User.addHook('beforeSave', function(user) {
    if(!user.isNewRecord) user.passwordChangedAt = Date.now() - 1000;
});

//verify password
User.prototype.correctPassword = async function(password) {
    console.log("se ejecuta el correct password");
    return await bcryptjs.compareSync(password, this.password);
}

//verify password has modified changed recently

module.exports = User;