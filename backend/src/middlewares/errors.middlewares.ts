import express from "express";
import ApiErrors from "../utils/api-errors";

const devErrors = (err: any, res: express.Response) =>
  res.status(err.statusCode!).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

const prodErrors = (err: any, res: express.Response) =>
  res.status(err.statusCode!).json({
    status: err.status,
    message: err.message,
  });

const handleJwtExpired = (message: string, res: express.Response) =>
  new ApiErrors(message, 401);

const globalErrors = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
    err = handleJwtExpired(`${req.__("please-login")}`, res);
  if (process.env.NODE_ENV === "development") devErrors(err, res);
  else prodErrors(err, res);
};

export default globalErrors;
