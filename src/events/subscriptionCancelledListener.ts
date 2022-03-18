import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  QueueGroupNames,
  SubscriptionCancelledEvent,
} from '@adidastest-phillip/common';
import { EmailService } from 'server/services';
import { cancelledMessage, cancelledSubscriptionSubject } from 'server/utils/constants/stringUtils';

/**
 * Receives details about a cancelled subscription from adidas-express-sub(subscription service)
 * */
export class SubscriptionCancelledListener extends Listener<SubscriptionCancelledEvent> {
  readonly subject = Subjects.SubscriptionCancelled;
  readonly queueGroupName = QueueGroupNames.EmailService;

  async onMessage(data: SubscriptionCancelledEvent['data'], msg: Message) {
    try {
      const { email, firstName } = data;
      console.log(`message received - ${msg.getSequence()}${email}${firstName}`);
      EmailService.sendEmail(email, cancelledMessage, cancelledSubscriptionSubject, firstName);
    } catch (err) {
      console.error(err);
    } finally {
      msg.ack();
    }
  }
}
