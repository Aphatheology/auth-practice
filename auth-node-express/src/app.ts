import express, { Request, Response } from 'express';
import passport from 'passport';
import config from './config/config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './utils/error';
import router from './router';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess, sendError } from './utils/apiResponse';
import './config/passport';


const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(express.json());
app.use(passport.initialize());

app.use("/api", router);

app.get("/v1", (req: Request, res: Response) => {
  sendSuccess(res, StatusCodes.OK, 'Welcome to Auth-Node-Express Project');
});

app.use("*error", (req: Request, res: Response) => {
  sendError(res, StatusCodes.NOT_FOUND, 'Route Not found');
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
