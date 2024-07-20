import express, { Request, Response, NextFunction } from "express";
import lusca from "lusca";
import cors from "cors";
import logger from "morgan";
import { ALLOWED_ORIGINS, NODE_ENV } from "./config";
import routes from "./routes";
import CustomError from "./util/CustomError";
import { connectDB } from "./db";

const app = express();

connectDB();

if (NODE_ENV !== "production") app.use(logger("dev"));

app.use(
  cors({ origin: ALLOWED_ORIGINS, preflightContinue: false, credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use("/api", routes);
app.use((req, res, next) => {
  next(new CustomError("Resource not found", 404));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // console.error(`Error time: ${new Date().toLocaleString()}`);
  // console.error(`Attempted resource URL: ${req.method} ${req.originalUrl}`);
  // console.error(error);
  let message = "Something went wrong";
  let status = 500;
  if (error instanceof CustomError) {
    message = error.getMessage();
    status = error.getStatus();
  }
  return res.status(status).json({ message });
});

export default app;
