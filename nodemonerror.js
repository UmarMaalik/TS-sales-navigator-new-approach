const nodemailer = require('nodemailer');

// Your email sending function
async function sendErrorMail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'umar.maalik@codeupscale.com',
      pass: 'yaim tapx bdtr nhbl',
    },
  });

  const mail = await transporter.sendMail({
    from: '"Sale navigator" <yourappinfo@gmail.com>',
    to: 'umermaalik44@gmail.com',
    subject: 'App Crash Notification',
    text: 'Your app has crashed. Please investigate.',
  });
}
sendErrorMail()
// Handle uncaught exceptions and unhandled promise rejections
