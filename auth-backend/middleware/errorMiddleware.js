// middlewares/errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
