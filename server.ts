import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import nodemailer from 'nodemailer'; // Import nodemailer
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// Setup your Nodemailer transporter
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
async function sendEmail(email: { from: string; subject: string; content: string }) {
  try {
    const info = await transporter.sendMail({
      from: process.env['GOOGLE_EMAIL_USER'],
      to: process.env['GOOGLE_EMAIL_USER'],
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
    console.error('Error sending email:', error);
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

  // Example Express Rest API endpoints
  server.post('/api/send-email', async (req, res) => {
    const { from, subject, content } = req.body; // Ensure body-parser is set up to handle JSON
    try {
      const response = await sendEmail({ from, subject, content });
      res.status(200).send(response);
    } catch (error) {
      if(error instanceof Error)
      res.status(500).send({ error: error.message });
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
