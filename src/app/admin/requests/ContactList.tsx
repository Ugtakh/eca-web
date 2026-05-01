'use client';

import { ContactSubmission } from '@/lib/cms/contact';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export default function ContactList({ submissions }: { submissions: ContactSubmission[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quote' | 'inquiry'>('all');

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || sub.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [submissions, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const quoteCount = submissions.filter((s) => s.type === 'quote').length;
  const inquiryCount = submissions.filter((s) => s.type === 'inquiry').length;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 border rounded-lg border-white/10 bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Нийт хүсэлт</p>
              <p className="text-3xl font-bold text-foreground">{submissions.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg border-white/10 bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Үнийн санал</p>
              <p className="text-3xl font-bold text-foreground">{quoteCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg border-white/10 bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Энгийн хүсэлт</p>
              <p className="text-3xl font-bold text-foreground">{inquiryCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div> */}

      {/* Table Section */}
      <div className="overflow-hidden border rounded-lg border-white/10 bg-surface">
        {/* Filters */}
        <div className="p-6 space-y-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-foreground">Хүсэлтүүдийн жагсаалт</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="Нэр, имэйл эсвэл утасаар хайх..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as 'all' | 'quote' | 'inquiry');
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded-lg border-white/10 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Бүгд</option>
              <option value="quote">Үнийн санал</option>
              <option value="inquiry">Энгийн хүсэлт</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {paginatedSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-12 h-12 mx-auto text-muted opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-sm text-muted">Хүсэлт олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-surface-2/50">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Нэр
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Имэйл
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Утас
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Компани
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Төрөл
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Илгээсэн
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-muted-2">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedSubmissions.map((submission) => (
                  <tr key={submission.id} className="transition-colors hover:bg-white/2">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{submission.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${submission.email}`}
                        className="block max-w-xs truncate text-accent hover:underline"
                        title={submission.email}
                      >
                        {submission.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">{submission.phone || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">{submission.company || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          submission.type === 'quote'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                            : 'bg-green-500/10 text-green-300 border border-green-500/30'
                        }`}
                      >
                        {submission.type === 'quote' ? 'Үнийн санал' : 'Хүсэлт'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">
                        {format(new Date(submission.submittedAt), 'MMM d, HH:mm')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => copyToClipboard(submission.email)}
                        className="text-xs font-medium text-accent hover:text-accent-bright transition-colors px-3 py-1.5 rounded hover:bg-white/5"
                      >
                        Хуулах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-sm text-muted">
              {filteredSubmissions.length} хүсэлтээс {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubmissions.length)} үзэх
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium transition-colors border rounded-lg border-white/10 text-foreground hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Өмнөх
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-accent text-white'
                        : 'border border-white/10 text-foreground hover:bg-white/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium transition-colors border rounded-lg border-white/10 text-foreground hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Дараах
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
