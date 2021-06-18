const Logger = require('../logger');

function send(subscription) {
  const logger = Logger.getLog();
  // TODO : Should send a real email
  logger.info(`
  Send email to : ${subscription.email}
  Subscription data : 
    ID: ${subscription.ID}
    dateOfBirth: ${subscription.dateOfBirth}
    consent: ${subscription.consent}
    NewsletterId: ${subscription.NewsletterId}
    firstName: ${subscription.firstName}
    gender: ${subscription.gender}
    created_at: ${subscription.created_at}
    updated_at: ${subscription.updated_at}
  `);
}

module.exports = {
  send,
};
