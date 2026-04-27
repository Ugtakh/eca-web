'use client';

import { type ReactNode, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import AppImage from '@/components/ui/AppImage';
import {
  createNewsArticleAction,
  deleteNewsArticleAction,
  updateNewsArticleAction,
  uploadNewsImageAction,
} from '@/lib/actions/news';
import { type NewsArticle } from '@/lib/cms/news';
import RichTextEditor from './RichTextEditor';

interface NewsCmsFormProps {
  initialArticles: NewsArticle[];
}

type UploadState = 'idle' | 'uploading' | 'error';
type ModalMode = { mode: 'create' } | { mode: 'edit'; article: NewsArticle } | null;

interface ModalShellProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyDraft(): Omit<NewsArticle, 'id'> {
  return {
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    imageAlt: '',
    publishedAt: todayIso(),
    readTime: '',
  };
}

function ModalShell({ title, subtitle, onClose, children }: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="my-8 w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mt-1 font-display text-2xl font-700 text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-foreground"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default function NewsCmsForm({ initialArticles }: NewsCmsFormProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [modal, setModal] = useState<ModalMode>(null);
  const [draft, setDraft] = useState<Omit<NewsArticle, 'id'>>(createEmptyDraft);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isMutating = activeOperation !== null;

  const runMutation = async (
    key: string,
    successMsg: string,
    task: () => Promise<void>
  ): Promise<boolean> => {
    const toastId = toast.loading('Хадгалж байна...');
    try {
      setActiveOperation(key);
      await task();
      toast.update(toastId, {
        render: successMsg,
        type: 'success',
        isLoading: false,
        autoClose: 2200,
        closeOnClick: true,
      });
      return true;
    } catch {
      toast.update(toastId, {
        render: 'Алдаа гарлаа. Дахин оролдоно уу.',
        type: 'error',
        isLoading: false,
        autoClose: 3200,
        closeOnClick: true,
      });
      return false;
    } finally {
      setActiveOperation(null);
    }
  };

  const closeModal = () => {
    setModal(null);
    setDraft(createEmptyDraft());
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreate = () => {
    setDraft(createEmptyDraft());
    setModal({ mode: 'create' });
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
  };

  const openEdit = (article: NewsArticle) => {
    setDraft({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      image: article.image,
      imageAlt: article.imageAlt,
      publishedAt: article.publishedAt,
      readTime: article.readTime,
    });
    setModal({ mode: 'edit', article });
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError('Файл сонгоно уу.');
      return;
    }
    const formData = new FormData();
    formData.append('files', file);
    try {
      setUploadState('uploading');
      setUploadError(null);
      const uploads = await uploadNewsImageAction(formData);
      const uploaded = uploads[0];
      if (!uploaded) throw new Error('Upload response хоосон');
      setDraft((prev) => ({
        ...prev,
        image: uploaded.src,
        imageAlt: prev.imageAlt.trim() || uploaded.alt,
      }));
      setUploadState('idle');
      setSelectedFileName(uploaded.alt);
    } catch {
      setUploadState('error');
      setUploadError('Upload хийх үед алдаа гарлаа.');
    }
  };

  const validate = (): boolean => {
    if (!draft.title.trim() || !draft.excerpt.trim() || !draft.category.trim() || !draft.publishedAt.trim()) {
      setFormError('Гарчиг, хураангуй, ангилал, огноог заавал бөглөнө үү.');
      return false;
    }
    return true;
  };

  const saveModal = async () => {
    if (!validate()) return;

    if (modal?.mode === 'create') {
      const ok = await runMutation('create', 'Мэдээ амжилттай нэмэгдлээ.', async () => {
        const created = await createNewsArticleAction(draft);
        setArticles((prev) => [created, ...prev]);
      });
      if (ok) closeModal();
      return;
    }

    if (modal?.mode === 'edit') {
      const id = modal.article.id;
      const ok = await runMutation('edit', 'Мэдээ шинэчлэгдлээ.', async () => {
        const updated = await updateNewsArticleAction(id, draft);
        setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
      });
      if (ok) closeModal();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const ok = await runMutation('delete', 'Мэдээ устгагдлаа.', async () => {
      await deleteNewsArticleAction(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    });
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/5 bg-surface p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-700 text-foreground">Мэдээний жагсаалт</h3>
              <p className="mt-1 text-sm text-muted">
                Мэдээ нэмэх, засах, устгах. Нийтлэгдсэн огноогоор буурахаар эрэмбэлэгдэнэ.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="tag-badge">{articles.length} мэдээ</span>
              <button
                type="button"
                onClick={openCreate}
                className="btn-primary"
                disabled={isMutating}
              >
                Шинэ мэдээ нэмэх
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['#', 'Гарчиг', 'Ангилал', 'Огноо', 'Зураг', 'Үйлдэл'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-2"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {articles.map((article, i) => (
                  <tr key={article.id} className="transition-colors hover:bg-surface-2">
                    <td className="px-3 py-3 font-mono text-xs text-muted">{i + 1}</td>
                    <td className="px-3 py-3 text-foreground">
                      <span className="inline-block max-w-[260px] truncate align-middle">
                        {article.title}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted">{article.category}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted">
                      {article.publishedAt}
                    </td>
                    <td className="px-3 py-3">
                      {article.image ? (
                        <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-white/5">
                          <AppImage
                            src={article.image}
                            alt={article.imageAlt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-2">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(article)}
                          className="rounded-md border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-xs text-blue-200 transition-colors hover:bg-blue-400/20"
                          disabled={isMutating}
                        >
                          Засах
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(article)}
                          className="rounded-md border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs text-red-200 transition-colors hover:bg-red-400/20"
                          disabled={isMutating}
                        >
                          Устгах
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted">
                      Мэдээ байхгүй байна. "Шинэ мэдээ нэмэх" товчоор нэмнэ үү.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <ModalShell
          title={modal.mode === 'create' ? 'Шинэ мэдээ нэмэх' : 'Мэдээ засах'}
          subtitle="Гарчиг, хураангуй, агуулга, ангилал, зургийг бөглөнө үү."
          onClose={closeModal}
        >
          <div className="space-y-5">
            {/* Title */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Гарчиг *
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                className="input-field"
                placeholder="Мэдээний гарчиг..."
              />
            </div>

            {/* Excerpt */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Хураангуй *
              </label>
              <textarea
                value={draft.excerpt}
                onChange={(e) => setDraft((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
                className="input-field resize-none"
                placeholder="Мэдээний богино тайлбар..."
              />
            </div>

            {/* Content — TipTap */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Агуулга (Rich Text)
              </label>
              <RichTextEditor
                content={draft.content}
                onChange={(html) => setDraft((p) => ({ ...p, content: html }))}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Category */}
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                  Ангилал *
                </label>
                <input
                  type="text"
                  value={draft.category}
                  onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                  className="input-field"
                  placeholder="Компанийн мэдээ, Төсөл..."
                />
              </div>

              {/* Read time */}
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                  Унших хугацаа
                </label>
                <input
                  type="text"
                  value={draft.readTime}
                  onChange={(e) => setDraft((p) => ({ ...p, readTime: e.target.value }))}
                  className="input-field"
                  placeholder="3 мин"
                />
              </div>
            </div>

            {/* Published date */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Нийтлэгдсэн огноо *
              </label>
              <input
                type="date"
                value={draft.publishedAt}
                onChange={(e) => setDraft((p) => ({ ...p, publishedAt: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Image URL */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Зургийн URL
              </label>
              <input
                type="text"
                value={draft.image}
                onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))}
                className="input-field"
                placeholder="https://..."
              />
              {draft.image && (
                <div className="relative mt-3 aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-white/5">
                  <AppImage
                    src={draft.image}
                    alt={draft.imageAlt || 'Preview'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Image alt */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Зургийн тайлбар (alt)
              </label>
              <input
                type="text"
                value={draft.imageAlt}
                onChange={(e) => setDraft((p) => ({ ...p, imageAlt: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* File upload */}
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">
                Зураг upload хийх
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedFileName(file?.name ?? '');
                  setUploadError(null);
                }}
                className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleUpload()}
                  className="btn-secondary"
                  disabled={uploadState === 'uploading' || isMutating}
                >
                  {uploadState === 'uploading' ? 'Upload хийж байна...' : 'Upload хийх'}
                </button>
                {selectedFileName && <span className="text-sm text-muted">{selectedFileName}</span>}
              </div>
              {uploadError && <p className="mt-3 text-sm text-red-300">{uploadError}</p>}
            </div>
          </div>

          {formError && (
            <div className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={closeModal} className="btn-secondary" disabled={isMutating}>
              Болих
            </button>
            <button
              type="button"
              onClick={() => void saveModal()}
              className="btn-primary"
              disabled={isMutating}
            >
              {activeOperation === 'create' || activeOperation === 'edit'
                ? 'Хадгалж байна...'
                : modal.mode === 'create'
                  ? 'Нэмэх'
                  : 'Шинэчлэх'}
            </button>
          </div>
        </ModalShell>
      )}

      {deleteTarget && (
        <ModalShell
          title="Мэдээ устгах"
          subtitle="Энэ үйлдэл буцаах боломжгүй."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="rounded-2xl border border-white/5 bg-surface p-5">
            <p className="text-sm text-muted">
              Та{' '}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget.title}&rdquo;
              </span>{' '}
              мэдээг устгахдаа итгэлтэй байна уу?
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="btn-secondary"
              disabled={isMutating}
            >
              Болих
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              className="rounded-lg border border-red-400/30 bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              disabled={isMutating}
            >
              {activeOperation === 'delete' ? 'Устгаж байна...' : 'Устгах'}
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
}
