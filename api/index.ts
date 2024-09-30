import { app } from 'server';
import nodemailer from 'nodemailer';

// The apps domain
const domain = process.env.DOMAIN_URL;

// Standard transporter object from nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.GOOGLE_MAIL_HOST as string,
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
export async function sendEmail(email: { from: string; subject: string; content: string }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL_USER, // or other sender
      to: process.env.GOOGLE_EMAIL_USER,
      replyTo: email.from,
      subject: `Message from ${email.from}: ${email.subject}`,
      text: `New message from ${email.from}:\n\nSubject: '${email.subject}'\n\nMessage:\n${email.content}\n\nReply to this email to contact ${email.from}.`,
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

// Initialize the server
export default async function initializeServer() {
  console.log("Server function initialized");
  return app();
}
