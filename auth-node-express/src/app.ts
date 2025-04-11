import express, { Request, Response } from 'express';
import config from './config/config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './utils/error';
import router from './router';
import { StatusCodes } from 'http-status-codes';


const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(express.json());

app.use("/api", router);

app.get("/v1", (req: Request, res: Response) => {
  res.send({ message: "Welcome to my Express TS Template" });
});

app.use("*error", (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: "Route Not found" });
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
