import { getRepository } from 'typeorm';
import request from 'supertest';
import { buildEmail, createEmail } from './factories';
import { Database, setUpRoutesAndMiddlewares } from './utils';
import { Email } from 'data/models';
import { app } from 'server/app';


const ENDPOINT = '/email';

describe('Email tests', () => {
  beforeAll(async () => {
    await Database.startDatabase();
    setUpRoutesAndMiddlewares();
  });

  afterAll(async () => {
    Database.dropDatabase();
  });

  beforeEach(async () => {
    await Database.connection.synchronize(true);
  });

  test('/POST - Response with a new created email', async () => {
    const emailRepository = getRepository(Email);

    const fakeEmail = await buildEmail({  });

    const emailBody = {
        ...fakeEmail,    };

    const response = await request(app).post(ENDPOINT).send(emailBody);
      
    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseEmail = response.body.data;

    const email = await emailRepository.findOne(responseEmail.id, {
        relations: [],
    });

    expect(email.email).toBe(fakeEmail.email);
    expect(email.emailType).toBe(fakeEmail.emailType);
    expect(email.message).toBe(fakeEmail.message);
    expect(email.subject).toBe(fakeEmail.subject);
    expect(new Date(email.createdAt)).toStrictEqual(fakeEmail.createdAt);
    
  });


  

  test('/GET - Response with a email', async () => {

    const email = await buildEmail({     });
    const fakeEmail = await createEmail(email);

    const response = await request(app).get(`${ENDPOINT}/${ fakeEmail.id }`);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    expect(data.id).toBe(fakeEmail.id);
    expect(data.email).toBe(fakeEmail.email);
    expect(data.emailType).toBe(fakeEmail.emailType);
    expect(data.message).toBe(fakeEmail.message);
    expect(data.subject).toBe(fakeEmail.subject);
    expect(new Date(data.createdAt)).toStrictEqual(fakeEmail.createdAt);

  });

  test('/GET - Response with a email not found', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;
    await emailRepository.delete(fakeEmail.id);
    
    const response = await request(app).get(`${ENDPOINT}/${ id }`);
    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });
  

  test('/GET - Response with a list of emails', async () => {
    const emailRepository = getRepository(Email);
    const response = await request(app).get(ENDPOINT);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    const allEmails = await emailRepository.find();
    expect(data.length).toBe(allEmails.length);
  });

  test('/PUT - Response with an updated email', async () => {
    const emailRepository = getRepository(Email);

    const email = await buildEmail({  });
    const fakeEmail = await createEmail(email);


    const anotherFakeEmail = await buildEmail({  });

    const { id } = fakeEmail;

    const response = await request(app)
      .put(`${ENDPOINT}/${ fakeEmail.id }`)
      .send({
        email: anotherFakeEmail.email,
        emailType: anotherFakeEmail.emailType,
        message: anotherFakeEmail.message,
        subject: anotherFakeEmail.subject,
        createdAt: anotherFakeEmail.createdAt,
      });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.email).toBe(anotherFakeEmail.email);
    expect(data.emailType).toBe(anotherFakeEmail.emailType);
    expect(data.message).toBe(anotherFakeEmail.message);
    expect(data.subject).toBe(anotherFakeEmail.subject);
    expect(new Date(data.createdAt)).toStrictEqual(anotherFakeEmail.createdAt);

    const updatedEmail = await emailRepository.findOne(id, { relations: [] });

    expect(updatedEmail.email).toBe(anotherFakeEmail.email);
    expect(updatedEmail.emailType).toBe(anotherFakeEmail.emailType);
    expect(updatedEmail.message).toBe(anotherFakeEmail.message);
    expect(updatedEmail.subject).toBe(anotherFakeEmail.subject);
    expect(new Date(updatedEmail.createdAt)).toStrictEqual(anotherFakeEmail.createdAt);
        
  });


  test('/PUT - Email does not exists, email cant be updated', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;
    await emailRepository.delete(id);
    
    const response = await request(app)
      .put(`${ENDPOINT}/${ id }`)
      .send({
        email: email.email,
        emailType: email.emailType,
        message: email.message,
        subject: email.subject,
        createdAt: email.createdAt,
      });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Response with an updated email (no updates)', async () => {

    const email = await buildEmail({  });
    const fakeEmail = await createEmail(email);

    const response = await request(app)
      .patch(`${ENDPOINT}/${ fakeEmail.id }`)
      .send({  });

    const { status } = response;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
  });

  test('/PATCH - Response with an updated email', async () => {
    const emailRepository = getRepository(Email);

    const email = await buildEmail({  });
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;


    const anotherFakeEmail = await buildEmail({  });

    const response = await request(app)
      .patch(`${ENDPOINT}/${ fakeEmail.id }`)
      .send({ email: anotherFakeEmail.email });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
    
    expect(data.email).toBe(anotherFakeEmail.email);
    
    const updatedEmail = await emailRepository.findOne(id)

    expect(updatedEmail.email).toBe(anotherFakeEmail.email);
  });

  test('/PATCH - Email does not exists, email cant be updated', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;
    const { email } = fakeEmail;
    await emailRepository.delete(id);

    const response = await request(app)
      .patch(`${ENDPOINT}/${ id }`)
      .send({ email });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
  
  test('/DELETE - Response with a deleted email', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);

    const response = await request(app)
      .delete(`${ENDPOINT}/${ fakeEmail.id }`);

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.id).toBe(fakeEmail.id);

    const deletedEmail = await emailRepository.findOne(fakeEmail.id);
    expect(deletedEmail).toBe(undefined);
  });
  
  test('/DELETE - Email does not exists, email cant be deleted', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;
    await emailRepository.delete(id);
    
    const response = await request(app)
      .delete(`${ENDPOINT}/${ id }`);

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
});

