const sgMail = require("@sendgrid/mail");

const sendEmail = function (receiver, message, subject) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiver,
    from: process.env.SENDER_EMAIL, // Use the email address or domain you verified above
    subject: subject,
    text: "and easy to do anywhere, even with Node.js",
    html: message,
  };
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};

module.exports = sendEmail;
