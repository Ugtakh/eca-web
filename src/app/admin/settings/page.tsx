import { getContactSectionInfo } from '@/lib/cms/contact-info';
import ContactInfoForm from './ContactInfoForm';

export const metadata = {
  title: 'Settings | Admin',
};

export default async function SettingsPage() {
  const contactInfo = await getContactSectionInfo();

  return (
    <div className="w-full space-y-8 ">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Тохиргоо</h1>
      </div>

      <div className="p-8 border rounded-lg border-white/10 bg-surface">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Бидэнтэй холбоо барих</h2>
          <p className="text-sm text-muted">Холбоо баригчийн хэсэгт харуулах мэдээллийг засна</p>
        </div>
        <ContactInfoForm initialData={contactInfo} />
      </div>
    </div>
  );
}
