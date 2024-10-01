import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import nodemailer from 'nodemailer'; // Import nodemailer
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import admin from './firebaseAdmin';

console.log({
  type: process.env["FIREBASE_TYPE"],
  projectId: process.env["FIREBASE_PROJECT_ID"],
  privateKeyId: process.env["FIREBASE_PRIVATE_KEY_ID"],
  privateKey: process.env["FIREBASE_PRIVATE_KEY"],
  clientEmail: process.env["FIREBASE_CLIENT_EMAIL"],
  clientId: process.env["FIREBASE_CLIENT_ID"],
});


// Initialize Firestore
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  host: process.env['GOOGLE_MAIL_HOST'],
  port: 465,
  auth: {
    type: 'OAuth2',
    user: process.env['GOOGLE_EMAIL_USER'],
    clientId: process.env['GOOGLE2_ID'],
    clientSecret: process.env['GOOGLE2_SECRET'],
    refreshToken: process.env['GOOGLE_REFRESH_TOKEN'],
  },
  secure: true,
});

// Function to send emails
async function sendEmail(email: { to: string; subject: string; content: string }) {
  try {
    const info = await transporter.sendMail({
      from: 'konstantinosporo@gmail.com',
      to: email.to,
      subject: `Message from ${email.to}: ${email.subject}`,
      text: `
        New message from ${email.to}:
        
        Subject:
        '${email.subject}'

        Message:
        ${email.content}

        Reply to this email to contact ${email.to}.
      `,
    });

    console.log('Email sent:', info.response, email.to);
    return { message: `Email sent successfully: ${info.response}` };
  } catch (error) {
    console.error('Error sending email:', error); // Log the error here to see more details
    throw new Error('Failed to send email');
  }
}


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(express.json());

  // send email api
  server.post('/api/send-email', async (req, res) => {
    const { to, subject, content } = req.body; // Ensure body-parser is set up to handle JSON
    try {
      const response = await sendEmail({ to, subject, content });
      console.log("Hello from server");
      res.status(200).send(response);
    } catch (error) {
      if(error instanceof Error)
      res.status(500).send({ error: error.message });
    }
  });

  // token verification api
server.get('/api/email-verification/:token', async (req, res) => {
  const { token } = req.params;
  console.log(`Received token for verification: ${token}`); // Log the received token

  try {
    const tokenDoc = await db.collection('verificationTokens').doc(token).get();

    console.log('Token document reference:');
    console.log('Token document data:', tokenDoc.exists); // Log existence of the document

    // Check if the token exists
    if (!tokenDoc.exists) {
      console.log('Token not found');
      return res.status(404).send({ error: 'Token not found' });
    }

    const tokenData = tokenDoc.data();
    console.log('Token data:', tokenData); // Log token data

    if (!tokenData || !tokenData['expiresAt']) {
      console.log('Invalid token data');
      return res.status(400).send({ error: 'Invalid token data' });
    }

    const expiresAt = tokenData['expiresAt'].toDate();
    if (expiresAt < new Date()) {
      console.log('Token has expired');
      return res.status(400).send({ error: 'Token has expired' });
    }

    console.log('Token verified successfully');
    return res.status(200).send({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});



  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}


// run the code on local host *for development

// const PORT = process.env['PORT'] || 4000;

// const server = app();

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });