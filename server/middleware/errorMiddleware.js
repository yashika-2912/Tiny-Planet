export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorMiddleware = (error, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: error.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
};
