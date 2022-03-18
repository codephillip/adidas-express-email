import { EmailRepository } from 'data/repositories';
import { checkEmail } from 'server/utils/constants/stringUtils';

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

  /**
   * Mock email sender
   * */
  static sendEmail(
    email: string,
    message: string,
    subject: string,
    firstName?: string,
    emailType?: string,
  ) {
    if (email.length && message.length && subject.length && checkEmail(email)) {
      console.log(`sent email to user email address ${email}`);
      this.create({
        emailAddress: email,
        message: `Hi ${firstName ?? 'User'}, ${message}`,
        subject,
        emailType: emailType ?? 'Newsletter',
      });
      return true;
    }
    return false;
  }
}
