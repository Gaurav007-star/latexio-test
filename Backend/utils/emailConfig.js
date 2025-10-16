const nodemailer = require('nodemailer');

let transporter;

/**
 * Create or return a cached SMTP transporter.
 * Uses environment variables:
 *  - SMTP_HOST
 *  - SMTP_PORT
 *  - SMTP_USER
 *  - SMTP_PASS
 *  - SMTP_SECURE (optional, 'true' or 'false')
 * If SMTP_HOST is not provided, falls back to a Nodemailer Ethereal test account.
 */

async function getTransporter() {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: (process.env.SMTP_SECURE === 'true') || (process.env.SMTP_PORT === '465'),
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            } : undefined,
        });
    } else {
        // fallback to Ethereal for development / testing
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    return transporter;
}

/**
 * Send an email using configured SMTP transport.
 * params:
 *  - to: recipient email (string)
 *  - subject: email subject (string)
 *  - text: plain text body (string, optional)
 *  - html: html body (string, optional)
 *  - from: optional from address override
 *
 * Returns an object with messageId and (for Ethereal) previewURL, plus accepted/rejected arrays.
 */
async function sendEmail({ to, subject, text, html, from } = {}) {
    if (!to || !subject || (!text && !html)) {
        throw new Error('Missing required email fields: to, subject and text/html');
    }

    const transport = await getTransporter();

    const mailOptions = {
        from: from || process.env.FROM_EMAIL || `no-reply@${process.env.SMTP_HOST || 'example.com'}`,
        to,
        subject,
        text,
        html,
    };

    const info = await transport.sendMail(mailOptions);

    return {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        previewURL: nodemailer.getTestMessageUrl(info) || null,
    };
}

module.exports = sendEmail;