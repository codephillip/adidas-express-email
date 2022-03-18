import express, { Router } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

import emailRouter from './routes/email.route';

import {
  errorHandler,
  responseHandler,
  pageNotFoundHandler,
  initResLocalsHandler,
} from './middlewares';

const app = express();

function setUpAPIRoutes() {
  process.env.API_VERSION = process.env.API_VERSION !== undefined ? process.env.API_VERSION : 'v1';
  // Swagger
  app.use(
    `/api/${process.env.API_VERSION}/emailSwagger`,
    swaggerUi.serveFiles(swaggerDocument),
    swaggerUi.setup(swaggerDocument),
  );

  // Middlewares
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(initResLocalsHandler);

  app.use(`/api/${process.env.API_VERSION}/emails`, emailRouter);

}

function useCustomRoute(route: string, router: Router) {
  app.use(route, router);
}

function setUpMiddlewares() {
  // Use custom response handler
  app.use(responseHandler);

  // Use custom error handler
  app.use(errorHandler);

  // Page not found
  app.use(pageNotFoundHandler);
}

export { app, useCustomRoute, setUpAPIRoutes, setUpMiddlewares };
