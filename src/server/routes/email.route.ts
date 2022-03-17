import { Router } from 'express';
import { validate } from 'express-validation';
import { EmailController } from 'server/controllers';
import { emailValidation, options } from 'server/validations';


const emailRouter = Router();

emailRouter.get('/', validate(emailValidation.getAll, options), EmailController.getAll);

emailRouter.get('/:id', EmailController.get);

emailRouter.post('/', validate(emailValidation.create, options), EmailController.create);

emailRouter.put('/:id', validate(emailValidation.update, options), EmailController.update);

emailRouter.patch('/:id', validate(emailValidation.partialUpdate, options), EmailController.partialUpdate);

emailRouter.delete('/:id', validate(emailValidation.destroy, options), EmailController.destroy);

export default emailRouter;

