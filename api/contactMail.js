import { IncomingForm } from 'formidable';
import fs from 'fs';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Form parsing error' });
    }

    const { email, message,  contact, name } = fields;
    const resumeFile = files.resume;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'MyMail0693@gmail.com',
        pass: 'vtderehxcmyqeznp',
      },
    });

    const mailOptions = {
      from: `"${name} via Website Contact" <MyMail0693@gmail.com>`,
      to: email,
      subject: `New Contact Message from ${name}`,
      text: `
Name: ${name}
Email:${mail}
Contact: ${contact}
Message: ${message}
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Mail sent successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to send email.' });
    }
  });
}
