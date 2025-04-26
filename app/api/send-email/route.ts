import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { repoUrl, developerEmail, exposedCredentials } = await request.json();

    // Validate required fields
    if (!repoUrl || !developerEmail || !exposedCredentials) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: developerEmail,
      subject: 'Security Alert: Exposed Credentials in Your Repository',
      html: `
        <h2>Security Alert: Exposed Credentials Detected</h2>
        <p>Hello,</p>
        <p>We have detected that your repository at ${repoUrl} contains exposed credentials or sensitive information.</p>
        <p>Exposed items:</p>
        <ul>
          ${exposedCredentials.map((cred: string) => `<li>${cred}</li>`).join('')}
        </ul>
        <p>For security reasons, we recommend:</p>
        <ol>
          <li>Immediately removing the exposed credentials</li>
          <li>Rotating any affected credentials</li>
          <li>Reviewing your repository for other potential security issues</li>
        </ol>
        <p>Best regards,<br>Security Team</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 