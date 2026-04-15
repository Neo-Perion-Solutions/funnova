const errorHandler = (err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  console.error('Stack:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;
