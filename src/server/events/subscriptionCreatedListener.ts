import {Message} from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  QueueGroupNames,
  SubscriptionCreatedEvent,
} from '@adidastest-phillip/common';
import {EmailService} from 'server/services';

/**
 * - Receives details about a subscription from unmc-express-sub(subscription service)
 * */
export class SubscriptionCreatedListener extends Listener<SubscriptionCreatedEvent> {
  readonly subject = Subjects.SubscriptionCreatedCreated;
  readonly queueGroupName = QueueGroupNames.EmailService;

  async onMessage(data: SubscriptionCreatedEvent['data'], msg: Message) {
    try {
      const {email, firstName} = data;
      console.log(`message received - ${msg.getSequence()}${email}${firstName}`);
      EmailService.create({
        emailAddress: email,
        message: 'Thank you for subscribing to the newsletter',
        subject: 'Newsletter subscription',
        emailType: 'Newsletter',
      });
    } catch (err) {
      console.error(err);
    } finally {
      msg.ack();
    }
  }
}
