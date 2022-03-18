const newsLetterMessage = 'Thank you for subscribing to the newsletter';
const newsLetterSubscriptionSubject = 'Newsletter subscription';
const cancelledMessage = 'You have cancelled your subscription to the news letter';
const cancelledSubscriptionSubject = 'Cancelled newsletter subscription';
const checkEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export {
  newsLetterMessage,
  newsLetterSubscriptionSubject,
  cancelledMessage,
  cancelledSubscriptionSubject,
  checkEmail,
};
