const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: "config.env" });

const db = new Sequelize(
    process.env.NODE_DB,
    process.env.USER_NAME,
    process.env.USER_PASSWORD,
    {
        host: process.env.NODE_HOST,
        dialect: 'mysql',
        port: process.env.NODE_PORT,
        define: {
            timestamps: false
        }
    },
);

module.exports = db;
