'use server';

import { Resend } from 'resend';
import { sendQuoteEmails } from '../email';
import { createContactSubmission } from '@/lib/cms/contact';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || '';

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  description: string;
}

export interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function submitQuoteRequestAction(data: QuoteRequest) {
  // validation
  if (!data.name || !data.email || !data.phone || !data.description) {
    throw new Error('Бүх талбарыг бөглөнө үү.');
  }

  if (!data.email.includes('@')) {
    throw new Error('Email буруу байна.');
  }

  try {
    const result = await sendQuoteEmails(data);

    await createContactSubmission({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || '',
      description: data.description,
      type: 'quote',
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Үнийн санал амжилттай илгээгдлээ',
      result,
    };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Үнийн санал илгээхэд алдаа гарлаа.');
  }
}

export async function submitInquiryAction(data: InquiryRequest) {
  if (!data.name || !data.email || !data.message) {
    throw new Error('Бүх талбарыг бөглөнө үү.');
  }

  try {
    const r = await resend.emails.send({
      from: 'noreply@eca.mn',
      to: adminEmail,
      subject: `Хүсэлт - ${data.name}`,
      html: `
        <h2>Шинэ хүсэлт</h2>
        <p><strong>Нэр:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Утас:</strong> ${data.phone || 'Заавал мэдээ өгөөгүй'}</p>
        <p><strong>Мессеж:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: data.email,
    });

    await createContactSubmission({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: '',
      description: data.message,
      type: 'inquiry',
    });

    revalidatePath('/');

    return { success: true, message: 'Хүсэлт илгээгдлээ. Баярлалаа!' };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Хүсэлт илгээхэд алдаа гарлаа.');
  }
}
