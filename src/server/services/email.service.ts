import { EmailRepository } from 'data/repositories';


export default class EmailService {
  static create(createBody: {
    emailAddress: string;
    message: string;
    subject: string;
    emailType?: string;
    createdAt?: Date;
  }) {
    return EmailRepository.create(createBody);
  }
  static get(id: string) {
    return EmailRepository.get(id);
  }

  
  static getAll(args: any) {
    return EmailRepository.getAll(args);
  }

  static getAllByPks(pks: number[]) {
    return EmailRepository.getAllByPks(pks);
  }
  
  static update(updateBody: {
    id: string;
    emailAddress: string;
    message: string;
    subject: string;
    emailType: string;
    createdAt: Date;
  }) {
    return EmailRepository.update(updateBody);
  }

  static partialUpdate(updateBody: {
    id: string;
    emailAddress?: string;
    message?: string;
    subject?: string;
    emailType?: string;
    createdAt?: Date;
  }) {
    return EmailRepository.partialUpdate(updateBody);
  }
  
  static destroy(id: string) {
    return EmailRepository.destroy(id);
  }
}

