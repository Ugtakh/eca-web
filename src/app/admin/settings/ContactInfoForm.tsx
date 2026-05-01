'use client';

import { ContactSectionInfo } from '@/lib/cms/contact-info';
import { updateContactInfoAction } from '@/lib/actions/contact-info';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactInfoForm({ initialData }: { initialData: ContactSectionInfo }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ContactSectionInfo, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateContactInfoAction(data);
      toast.success('Холбоо баригчийн мэдээллийг амжилттай өөрчилсөн', { autoClose: 3000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Алдаа гарлаа';
      toast.error(message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Утас (1)</label>
          <input
            type="tel"
            value={data.phone1}
            onChange={(e) => handleChange('phone1', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="9901-5338"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Утас (2)</label>
          <input
            type="tel"
            value={data.phone2}
            onChange={(e) => handleChange('phone2', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="7575-1111"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-foreground">Имэйл</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="info@eca.mn"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-foreground">Хаяг</label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Улаанбаатар хот, Чингэлтэй дүүрэг"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-foreground">
          Байр / Барилгын нэр
        </label>
        <input
          type="text"
          value={data.building}
          onChange={(e) => handleChange('building', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="MN тауэр"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-bright disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {loading ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
      </div>
    </form>
  );
}
