import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock transport for development - prints to console
// In a real app, you'd use a real SMTP service (e.g., SendGrid, Gmail)
// or use 'ethereal' for testing: https://ethereal.email/
const transporter = nodemailer.createTransport({
    jsonTransport: true
});

app.post('/api/subscribe', async (req, res) => {
    const { email, birthChart, dailyHoroscope } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    const mailOptions = {
        from: '"My Whimsical Astro App" <no-reply@astroapp.com>',
        to: email,
        subject: 'Your Daily Whimsical Horoscope ✨',
        text: `
Hello Stargazer! ✨

Here is your astrology for today:

${dailyHoroscope}

Birth Details:
${JSON.stringify(birthChart, null, 2)}

Stay aligned with the stars!
        `,
        html: `
<div style="font-family: sans-serif; color: #4a4a4a; padding: 20px; background-color: #fcebd9;">
  <h1 style="color: #6b3fa0;">✨ Your Daily Whimsical Horoscope ✨</h1>
  <p>Hello Stargazer!</p>
  <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 1.1em; line-height: 1.6;">${dailyHoroscope.replace(/\n/g, '<br/>')}</p>
  </div>
  <p style="font-size: 0.9em; margin-top: 20px; color: #888;">
    Based on birth chart:<br/>
    ${JSON.stringify(birthChart, null, 2)}
  </p>
</div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent (mock):', info.messageToString());
        res.status(200).send({ message: 'Email subscribed successfully (Mock)! Check server console.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
