import { Joi } from 'express-validation';
import { emailEmailTypeChoices } from 'server/utils/constants/fieldChoices';


const emailValidation = {
  getAll: {
    query: Joi.object({
      id: Joi.string().uuid({ version: [ 'uuidv4' ] }),
      emailAddress: Joi.string().max(255),
      emailType: Joi.string().valid(...emailEmailTypeChoices).max(255),
      message: Joi.string().max(2000),
      subject: Joi.string().max(255),
      createdAt: Joi.date(),
    }),
  },
  create: {
    body: Joi.object({
      emailAddress: Joi.string().max(255).required(),
      emailType: Joi.string().valid(...emailEmailTypeChoices).max(255),
      message: Joi.string().max(2000).required(),
      subject: Joi.string().max(255).required(),
      createdAt: Joi.date(),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.string().uuid({ version: [ 'uuidv4' ] }).required(),
    }),
    body: Joi.object({
      emailAddress: Joi.string().max(255).required(),
      emailType: Joi.string().valid(...emailEmailTypeChoices).max(255).required(),
      message: Joi.string().max(2000).required(),
      subject: Joi.string().max(255).required(),
      createdAt: Joi.date().required(),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      id: Joi.string().uuid({ version: [ 'uuidv4' ] }).required(),
    }),
    body: Joi.object({
      emailAddress: Joi.string().max(255),
      emailType: Joi.string().valid(...emailEmailTypeChoices).max(255),
      message: Joi.string().max(2000),
      subject: Joi.string().max(255),
      createdAt: Joi.date(),
    }),
  },
  destroy: {
    params: Joi.object({
      id: Joi.string().uuid({ version: [ 'uuidv4' ] }).required(),
    }),
  },
};

export default emailValidation;

