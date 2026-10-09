
// or however dotenvx is invoked in your project
const nodemailer = require('nodemailer');


// Validate required env vars up front so failures are obvious
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

if (!EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error(
        'Missing EMAIL_USER or EMAIL_PASSWORD environment variable(s). Check your .env file.'
    );
}

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD, // use a Gmail App Password, not your regular password
    },
});

// Optional: verify connection config at startup (logs early instead of failing on first send)
transporter.verify((err) => {
    if (err) {
        console.error('Nodemailer configuration error:', err.message);
    } else {
        console.log('Nodemailer is ready to send emails');
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (err) {
        console.error('Failed to send email:', err.message);
        throw err;
    }
};

module.exports = sendEmail;