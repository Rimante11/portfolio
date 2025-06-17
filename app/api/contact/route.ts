import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createEmailTemplate } from '@/src/email-template';

export async function POST(request: Request) {
  try {
    const { email, subject, message } = await request.json();

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Missing email configuration. Please check your environment variables.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: createEmailTemplate(email, subject, message),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}