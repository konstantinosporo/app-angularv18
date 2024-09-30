import nodemailer from 'nodemailer';
import { app } from '../dist/app-angularv18/server/server.mjs';

// Create the transporter outside of the app function
const transporter = nodemailer.createTransport({
  host: process.env.GOOGLE_MAIL_HOST,
  port: 465,
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_EMAIL_USER,
    clientId: process.env.GOOGLE2_ID,
    clientSecret: process.env.GOOGLE2_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
  secure: true,
});

// Function to send emails
export async function sendEmail(email) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: process.env.MAIL_USERNAME,
      replyTo: email.from,
      subject: `Message from ${email.from}: ${email.subject}`,
      text: `
        New message from ${email.from}:

        Subject:
        '${email.subject}'

        Message:
        ${email.content}

        Reply to this email to contact ${email.from}.
      `,
    });

    console.log('Email sent:', info.response);
    return `Email sent successfully: ${info.response}`;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Failed to send email due to an unknown error');
    }
  }
}

// Export and initialize the Express app
export default async function handler(req, res) {
  console.log("Server function initialized");

  // Initialize the app
  const expressApp = await app();

  // Example endpoint to handle sending emails
  expressApp.post('/send-email', async (req, res) => {
    try {
      const emailData = req.body; // Ensure you have middleware to parse JSON
      const response = await sendEmail(emailData);
      res.status(200).send(response);
    } catch (error) {
      console.error('Failed to send email:', error);
      res.status(500).send('Error sending email');
    }
  });

  // Add your other routes and middleware here
}
