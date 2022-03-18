import { getRepository } from 'typeorm';
import request from 'supertest';
import { Email } from 'data/models';
import { app } from 'server/app';
import { EmailService } from 'server/services';
import { checkEmail } from 'server/utils/constants/stringUtils';
import { Database, setUpRoutesAndMiddlewares } from './utils';
import { buildEmail, createEmail } from './factories';

const ENDPOINT = '/api/v1/emails';

describe('Email tests', () => {
  beforeAll(async () => {
    await Database.startDatabase();
    setUpRoutesAndMiddlewares();
    process.env.NODE_ENV = 'v1';
  });

  afterAll(async () => {
    Database.dropDatabase();
  });

  beforeEach(async () => {
    await Database.connection.synchronize(true);
  });

  test('/POST - Response with a new created email', async () => {
    const emailRepository = getRepository(Email);

    const fakeEmail = await buildEmail({});

    const emailBody = {
      ...fakeEmail,
    };

    const response = await request(app).post(ENDPOINT).send(emailBody);

    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseEmail = response.body.data;

    const email = await emailRepository.findOne(responseEmail.id, {
      relations: [],
    });

    expect(email.emailAddress).toBe(fakeEmail.emailAddress);
    expect(email.emailType).toBe(fakeEmail.emailType);
    expect(email.message).toBe(fakeEmail.message);
    expect(email.subject).toBe(fakeEmail.subject);
    expect(new Date(email.createdAt)).toStrictEqual(fakeEmail.createdAt);
  });

  test('/GET - Response with a email', async () => {
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);

    const response = await request(app).get(`${ENDPOINT}/${fakeEmail.id}`);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    expect(data.id).toBe(fakeEmail.id);
    expect(data.emailAddress).toBe(fakeEmail.emailAddress);
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

    const response = await request(app).get(`${ENDPOINT}/${id}`);
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

    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);

    const anotherFakeEmail = await buildEmail({});

    const { id } = fakeEmail;

    const response = await request(app).put(`${ENDPOINT}/${fakeEmail.id}`).send({
      emailAddress: anotherFakeEmail.emailAddress,
      emailType: anotherFakeEmail.emailType,
      message: anotherFakeEmail.message,
      subject: anotherFakeEmail.subject,
      createdAt: anotherFakeEmail.createdAt,
    });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.emailAddress).toBe(anotherFakeEmail.emailAddress);
    expect(data.emailType).toBe(anotherFakeEmail.emailType);
    expect(data.message).toBe(anotherFakeEmail.message);
    expect(data.subject).toBe(anotherFakeEmail.subject);
    expect(new Date(data.createdAt)).toStrictEqual(anotherFakeEmail.createdAt);

    const updatedEmail = await emailRepository.findOne(id, { relations: [] });

    expect(updatedEmail.emailAddress).toBe(anotherFakeEmail.emailAddress);
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

    const response = await request(app).put(`${ENDPOINT}/${id}`).send({
      emailAddress: email.emailAddress,
      emailType: email.emailType,
      message: email.message,
      subject: email.subject,
      createdAt: email.createdAt,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Response with an updated email (no updates)', async () => {
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);

    const response = await request(app).patch(`${ENDPOINT}/${fakeEmail.id}`).send({});

    const { status } = response;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
  });

  test('/PATCH - Response with an updated email', async () => {
    const emailRepository = getRepository(Email);

    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;

    const anotherFakeEmail = await buildEmail({});

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeEmail.id}`)
      .send({ emailAddress: anotherFakeEmail.emailAddress });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.emailAddress).toBe(anotherFakeEmail.emailAddress);

    const updatedEmail = await emailRepository.findOne(id);

    expect(updatedEmail.emailAddress).toBe(anotherFakeEmail.emailAddress);
  });

  test('/PATCH - Email does not exists, email cant be updated', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);
    const { id } = fakeEmail;
    const { emailAddress } = fakeEmail;
    await emailRepository.delete(id);

    const response = await request(app).patch(`${ENDPOINT}/${id}`).send({ emailAddress });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/DELETE - Response with a deleted email', async () => {
    const emailRepository = getRepository(Email);
    const email = await buildEmail({});
    const fakeEmail = await createEmail(email);

    const response = await request(app).delete(`${ENDPOINT}/${fakeEmail.id}`);

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

    const response = await request(app).delete(`${ENDPOINT}/${id}`);

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('Successful sending email to user', async () => {
    const result = EmailService.sendEmail('hello@example.com', 'Message', 'Subject', 'Phillip');
    expect(result).toBe(true);
  });

  test('Successful sending email to user without firstname', async () => {
    const result = EmailService.sendEmail('hello@example.com', 'Message', 'Subject');
    expect(result).toBe(true);
  });

  test('Failed sending email to user', async () => {
    const result = EmailService.sendEmail('helloexample.com', '', 'Subject', 'Phillip');
    expect(result).toBe(false);
  });

  test('Check email contains @', () => {
    expect(checkEmail('codephillip@gmail.com')).toBe(true);
  });

  test('Check email without @ is reject', () => {
    expect(checkEmail('codephillipgmail.com')).toBe(false);
  });
});
