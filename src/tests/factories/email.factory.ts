import {date, random} from 'faker';
import {getRepository} from 'typeorm';
import {emailEmailTypeChoices} from '../../server/utils/constants/fieldChoices';
import {Email} from 'data/models';
import {dateToUTC, getRandomValueFromArray} from 'server/utils/functions';


interface EmailRelations {
}

async function buildEmail(email: EmailRelations): Promise<Email> {
  const resEmail = new Email();

  resEmail.emailAddress = random.word().slice(0, 255);
  resEmail.emailType = getRandomValueFromArray(emailEmailTypeChoices);
  resEmail.message = random.word().slice(0, 2000);
  resEmail.subject = random.word().slice(0, 255);
  resEmail.createdAt = new Date(dateToUTC(date.past()).format('YYYY-MM-DDTHH:mm:ss[.000Z]'));


  return Promise.resolve(resEmail);
};


async function createEmail(fakeEmail: Email): Promise<Email> {
  const repository = getRepository(Email);
  const email = repository.create(fakeEmail);
  await repository.save(email);

  return email;
};

export {buildEmail, createEmail};

