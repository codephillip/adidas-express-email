import {Message} from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  QueueGroupNames,
  SubscriptionCreatedEvent,
} from '@adidastest-phillip/common';
import {EmailService} from 'server/services';
import {newsLetterMessage, newsLetterSubscription} from "server/utils/constants/stringUtils";


/**
 * Receives details about a subscription from adidas-express-sub(subscription service)
 * */
export class SubscriptionCreatedListener extends Listener<SubscriptionCreatedEvent> {
  readonly subject = Subjects.SubscriptionCreated;
  readonly queueGroupName = QueueGroupNames.EmailService;

  async onMessage(data: SubscriptionCreatedEvent['data'], msg: Message) {
    try {
      const {email, firstName} = data;
      console.log(`message received - ${msg.getSequence()}${email}${firstName}`);
      EmailService.sendEmail(email, newsLetterMessage, newsLetterSubscription, firstName);
    } catch (err) {
      console.error(err);
    } finally {
      msg.ack();
    }
  }
}
