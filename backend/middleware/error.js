const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal Server Error";

    //Wrong MongoDb Id Error
    if (err.name === "CastError") {
        const message = `Resource not found ,Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    //JWT wrong error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid! try again`;
        err = new ErrorHandler(message, 400);
    }
    //JWT Expired Error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired ! try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}