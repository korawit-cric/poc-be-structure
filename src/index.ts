import express, { Router } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import fs from "fs";

import { errorHandler, errorLogger } from "@/middlewares/errorHandler";
import { sanitizeRequestBody } from "@/middlewares/requestSanitizer";
import { initializeLogger, logger } from "@/middlewares/logger";
import initializeRouter from "@/routes";
import { initializeDB } from "@/db";

const initializeServer = async () => {
  const app = express();
  // cors() is a middleware function that enables CORS (Cross-Origin Resource Sharing)
  // requests to the Express.js server.
  // It sets the following headers in the response:
  // - Access-Control-Allow-Origin: specifies the domains that are allowed
  //   to access the resource
  // - Access-Control-Allow-Methods: specifies the HTTP methods that are allowed
  //   to access the resource
  // - Access-Control-Allow-Headers: specifies the headers that are allowed
  //   to be included in the request
  // - Access-Control-Allow-Credentials: specifies whether cookies are allowed
  //   to be included in the request
  app.use(
    cors({
      credentials: true, // allow cookies to be included in the request
      origin: process.env.CLIENT_ORIGIN, // specify the domains that are allowed to access the resource
    })
  );

  // This middleware parses the request body as JSON and populates req.body with the parsed data.
  // It also parses the request body as URL encoded data (key=value&foo=bar) and populates req.body with the parsed data.
  // The extended: false option tells the middleware not to parse the request body as an array or an object with a single key=value pair.
  // Instead, it will parse the request body as a simple key=value pair.
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // cookie-parser is a middleware that parses the Cookie header in the request and populates req.cookies with the parsed data.
  // It also populates req.signedCookies with the parsed data if the secret option is provided.
  // The secret option is used to sign the cookies and to verify that the cookies have not been tampered with.
  // app.use(cookieParser(process.env.COOKIE_SECRET)); // COOKIE_SECRET cana be defined in the .env file
  app.use(cookieParser());

  // ----- Modules Initializer -----
  initializeLogger(app);
  await initializeDB(app);

  // ----- Request Parsing and Sanitization -----
  // Body parser parses the request body and populates req.body with the parsed data.
  // bodyParser.json() parses the request body as JSON and populates req.body with the parsed data.
  // bodyParser.urlencoded({ extended: true }) parses the request body as URL encoded data (key=value&foo=bar) and populates req.body with the parsed data.
  app.use(bodyParser.json());
  app.use(sanitizeRequestBody);
  app.use(bodyParser.urlencoded({ extended: true }));

  // ----- Routers -----
  initializeRouter(app);
  //   initializeV1Router(app);

  // ----- Health Check and Error Handling ------
  initializeReportDirectory();

  app.use(healthRouter);
  app.use(errorHandler);
  app.use(errorLogger);

  // ----- Port ------
  app.listen(3001, () => {
    logger.info("Start server at port 3001.");
  });
};

const initializeReportDirectory = () => {
  const path = "temp/reports";
  fs.mkdirSync(path, { recursive: true });
};

const healthRouter = Router();
healthRouter.get("/health", (req, res) => {
  res.status(204).send();
});

void initializeServer();
