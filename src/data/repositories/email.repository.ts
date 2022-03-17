import { getRepository } from 'typeorm';
import { Email } from 'data/models';
import { NotFound } from 'server/utils/errors';


export default class EmailRepository {
  static async create(createBody: {
    email: string;
    message: string;
    subject: string;
    emailType?: string;
    createdAt?: Date;
  }) {
    const emailRepository = getRepository(Email);
    const createdEmail: Email = emailRepository.create(createBody);
    return emailRepository.save(createdEmail);
}
  static get(id: string) {
    const emailRepository = getRepository(Email);
    return emailRepository.findOne({
      where: { id },
      relations: [],
    });
  }
  static getAll(filters: any) {
    const emailRepository = getRepository(Email);
    return emailRepository.find({
      where: filters,
      relations: [],
    });
  }
  static getAllByPks(pks: number[]) {
    const emailRepository = getRepository(Email);
    return emailRepository.findByIds(pks);
  }
  static async update(updateBody: {
    id: string;
    email: string;
    message: string;
    subject: string;
    emailType: string;
    createdAt: Date;
  }) {
    return this.partialUpdate(updateBody);
  }
  
  static async partialUpdate(updateBody: {
    id: string;
    email?: string;
    message?: string;
    subject?: string;
    emailType?: string;
    createdAt?: Date;
  }) {
    const emailRepository = getRepository(Email);
    const foundEmail: Email = await emailRepository.findOne(updateBody.id);
    
    if (!foundEmail) throw new NotFound(`Email with primary key ${ updateBody.id } not found`);
    if(updateBody.email !== undefined) foundEmail.email = updateBody.email;
    if(updateBody.emailType !== undefined) foundEmail.emailType = updateBody.emailType;
    if(updateBody.message !== undefined) foundEmail.message = updateBody.message;
    if(updateBody.subject !== undefined) foundEmail.subject = updateBody.subject;
    if(updateBody.createdAt !== undefined) foundEmail.createdAt = updateBody.createdAt;
    await emailRepository.save(foundEmail);
    return foundEmail;
  }
  static async destroy(id: string) {
    const emailRepository = getRepository(Email);
    const foundEmail = await emailRepository.findOne(id);
    
    if (!foundEmail) throw new NotFound(`Email with primary key ${ id } not found`);
    
    await emailRepository.delete(id);
    return foundEmail;
  }
}

