require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Banking System" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendWelcomeEmail(userEmail, userName) {
    const subject = "Welcome to Backend Banking System!";
    const text = `Hello ${userName},\n\nThank you for registering at Backend Banking System. We're excited to have you on board!\n\nBest regards,\nThe Backend Banking System Team`;
    const html = `<p>Hello ${userName},</p><p>Thank you for registering at Backend Banking System. We're excited to have you on board!</p><p>Best regards,<br>The Backend Banking System Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Sucessfull";
    const text = `Hello ${name},\n\nThank you for using Backend Banking System. Your transaction of ${amount} to ${toAccount} has been completed.\n\nBest regards,\nThe Backend Banking System Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for using Backend Banking System. Your transaction of ${amount} to ${toAccount} has been completed.</p><p>Best regards,<br>The Backend Banking System Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Failed";
    const text = `Hello ${name},\n\nThank you for using Backend Banking System. Your transaction of ${amount} to ${toAccount} has been failed.\n\nBest regards,\nThe Backend Banking System Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for using Backend Banking System. Your transaction of ${amount} to ${toAccount} has been failed.</p><p>Best regards,<br>The Backend Banking System Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    transporter,
    sendEmail,
    sendWelcomeEmail,
    sendTransactionEmail,
    sendTransactionFailEmail
};
