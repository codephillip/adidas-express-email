const newsLetterMessage = 'Thank you for subscribing to the newsletter';
const newsLetterSubscription = 'Newsletter subscription';
const checkEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export { newsLetterMessage, newsLetterSubscription, checkEmail };
