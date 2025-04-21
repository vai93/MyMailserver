import nodemailer from 'nodemailer';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Form parsing error' });
    }

    const { email, message, feedback, rating, contact, name } = fields;
    const resumeFile = files.resume;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'MyMail0693@gmail.com',
        pass: 'vtderehxcmyqeznp', // Make sure to keep this secret in production
      },
    });

    const mailOptions = {
      from: '"UKF/ISC Feedback" <MyMail0693@gmail.com>',
      to: email,
      subject: `Feedback from ${name}`,
      text: `
Name: ${name}
Contact: ${contact}
Rating: ${rating}
Feedback: ${feedback}
Message: ${message}
      `,
      attachments: resumeFile ? [{
        filename: resumeFile.originalFilename,
        content: fs.readFileSync(resumeFile.filepath)
      }] : []
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Feedback sent successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to send email.' });
    }
  });
}
