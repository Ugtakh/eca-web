import { getContactSubmissions } from '@/lib/cms/contact';
import ContactList from './ContactList';

export const metadata = {
  title: 'Contact Submissions | Admin',
};

export default async function ContactAdminPage() {
  const submissions = await getContactSubmissions(500);

  return <ContactList submissions={submissions} />;
}
