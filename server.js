process.on('uncaughtException', function(err) {
    console.log(err.name, err.message);
    console.log("UNCAUGHTEXCEPTION, shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

//connection - database
const db = require('./config/db');
try {
    db.sync();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//models - database

//middlewares
const app = require('./app');

//connection - server
const port = process.env.PORT || 5000;
const server = app.listen(port, function() {
    console.log("server connection in port: 5000");
});

process.on('unhandledRejection', function(err) {
    console.log(err.name, err.message);
    console.log("UNHANDLEDREJECTION, shutting down...");
    server.close(()=>{
        process.exit(1);
    });  
})
