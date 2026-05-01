import { QuoteUserEmail } from '@/emails/templates/QuoteUser';
import { QuoteAdminEmail } from '@/emails/templates/QuoteAdmin';

import { Resend } from 'resend';
import { render } from '@react-email/render';
const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || '';

export async function sendQuoteEmails(data: any) {
  const adminTemplate = await render(<QuoteAdminEmail data={data} />);
  // 1. Admin email
  await resend.emails.send({
    from: 'noreply@eca.mn',
    to: adminEmail,
    subject: 'Шинэ хүсэлт',
    html: adminTemplate,
  });

  // 2. User email
  const userTemplate = await render(<QuoteUserEmail data={data} />);
  await resend.emails.send({
    from: 'noreply@eca.mn',
    to: data.email,
    subject: 'Таны хүсэлтийг хүлээн авлаа',
    html: userTemplate,
  });
}
