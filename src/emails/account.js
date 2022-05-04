const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'lucijaf@protonmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app ${name}. Let me know how you get along with app.`
  })

}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'lucijaf@protonmail.com',
    subject: 'Goodbye!',
    text: `${name}, we are sorry you are leaving TaskManagerApp.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}