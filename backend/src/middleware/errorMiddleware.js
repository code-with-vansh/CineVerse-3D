export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    statusCode = 400;
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    message = `Duplicate value violation for ${target}. Please use a unique value.`;
  }

  // Handle Prisma record not found (P2025)
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested record not found in database.';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired.';
  }

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};
