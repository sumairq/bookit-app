const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  // 400 represents bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // In the latest version of mongodb errmsg is nested within errorResponse
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // In the latest version of mongodb errmsg is nested within errorResponse
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details to the client
  } else {
    // 1) Log error
    console.error('ERROR!!!', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'err',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, _req, res, _next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Use Object.assign to preserve error properties and prototype
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    // According vid-119 we do shallow copying but in this case we don't get access to error.name property so we do a deep copy.
    // let error = { ...err };

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }
};

// We can extend for other types of errors by marking them operation in the similar way we have marked the 3 types of mongoose errors above.

// This error handling is quite sophisticated for a small application however can introduce more things like error severity level , for example
//Error severity level could be  low , medium, high, critical. and we can send email to administrator about the errors depending upon the severity.
