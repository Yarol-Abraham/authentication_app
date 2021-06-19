const { DataTypes } = require('sequelize');
const db = require('../config/db');
const appError = require('../utils/appError');

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
            customValidator(value) {
                if (value === null && this.password === value) {
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

module.exports = User;