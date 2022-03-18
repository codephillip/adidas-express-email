import {Request, Response, NextFunction} from 'express';
import {CREATED} from 'http-status';
import {EmailService} from 'server/services';
import {NotFound} from 'server/utils/errors';
import {newsLetterMessage, newsLetterSubscriptionSubject} from "server/utils/constants/stringUtils";


export default class EmailController {
  static async runServiceAction(req: Request, serviceAction: Function) {
    const id = req.params.id;
    const {
      emailAddress,
      message,
      subject,
      emailType,
      createdAt,
    } = req.body;
    if (id !== undefined) {
      return serviceAction({
        id,
        emailAddress,
        message,
        subject,
        emailType,
        createdAt,
      });
    }
    return serviceAction({
      emailAddress,
      message,
      subject,
      emailType,
      createdAt,
    });
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newEmail = await EmailController.runServiceAction(req, EmailService.create);
      res.locals.status = CREATED;
      res.locals.data = newEmail;
      //TODO ADD firstname to model
      EmailService.sendEmail(
        newEmail.emailAddress,
        newsLetterMessage,
        newsLetterSubscriptionSubject,
        '',
        newEmail.emailType,
      );
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const emailObject = await EmailService.get(id);
      if (!emailObject) {
        throw new NotFound(`Email with primary key ${id} not found`);
      }

      res.locals.data = emailObject;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {...req.query};
      const allEmails = await EmailService.getAll(filters);
      res.locals.data = allEmails;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedEmail = await EmailController.runServiceAction(req, EmailService.update);
      res.locals.data = updatedEmail;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async partialUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedEmail = await EmailController.runServiceAction(req, EmailService.partialUpdate);
      res.locals.data = updatedEmail;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const emailDelete = await EmailService.destroy(id);
      res.locals.data = emailDelete;

      return next();
    } catch (error) {
      return next(error);
    }
  }
};

