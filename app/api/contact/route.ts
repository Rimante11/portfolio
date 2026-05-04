import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createEmailTemplate } from '@/src/email-template';
import { z } from 'zod';

const contactRequestSchema = z.object({
  email: z.string().trim().email('A valid email is required.'),
  subject: z.string().trim().min(1, 'Subject is required.'),
  message: z.string().trim().min(1, 'Message is required.'),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = contactRequestSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { email, subject, message } = parsed.data;

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
      to: process.env.EMAIL_USER,
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