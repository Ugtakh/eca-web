'use client';

import { type ReactNode, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import AppImage from '@/components/ui/AppImage';
import {
  createProjectItemAction,
  deleteProjectItemAction,
  updateProjectItemAction,
  uploadProjectImagesAction,
} from '@/lib/actions/projects-section';
import { type ProjectItem } from '@/lib/cms/projects-section';

interface ProjectsCmsFormProps {
  initialProjects: ProjectItem[];
}

type UploadState = 'idle' | 'uploading' | 'error';
type ModalMode = { mode: 'create' } | { mode: 'edit'; item: ProjectItem } | null;

function tagsToText(t: string[]) {
  return t.join('\n');
}
function parseTags(s: string) {
  return s
    .split(/\n|,/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function emptyDraft(): Omit<ProjectItem, 'id'> {
  return {
    title: '',
    category: '',
    year: new Date().getFullYear().toString(),
    area: '',
    image: '',
    imageAlt: '',
    tags: [],
  };
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mt-1 text-2xl font-display font-700 text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 border rounded-full shrink-0 border-white/10 text-muted hover:text-foreground"
          >
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default function ProjectsCmsForm({ initialProjects }: ProjectsCmsFormProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [modal, setModal] = useState<ModalMode>(null);
  const [draft, setDraft] = useState<Omit<ProjectItem, 'id'>>(emptyDraft);
  const [tagsText, setTagsText] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const isMutating = activeOp !== null;

  const run = async (key: string, msg: string, task: () => Promise<void>) => {
    const tid = toast.loading('Хадгалж байна...');
    try {
      setActiveOp(key);
      await task();
      toast.update(tid, {
        render: msg,
        type: 'success',
        isLoading: false,
        autoClose: 2200,
        closeOnClick: true,
      });
      return true;
    } catch {
      toast.update(tid, {
        render: 'Алдаа гарлаа.',
        type: 'error',
        isLoading: false,
        autoClose: 3200,
        closeOnClick: true,
      });
      return false;
    } finally {
      setActiveOp(null);
    }
  };

  const closeModal = () => {
    setModal(null);
    setDraft(emptyDraft());
    setTagsText('');
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const openCreate = () => {
    setDraft(emptyDraft());
    setTagsText('');
    setModal({ mode: 'create' });
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
  };
  const openEdit = (item: ProjectItem) => {
    setDraft({
      title: item.title,
      category: item.category,
      year: item.year,
      area: item.area,
      image: item.image,
      imageAlt: item.imageAlt,
      tags: item.tags,
    });
    setTagsText(tagsToText(item.tags));
    setModal({ mode: 'edit', item });
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadError('Файл сонгоно уу.');
      return;
    }
    const fd = new FormData();
    fd.append('files', file);
    try {
      setUploadState('uploading');
      setUploadError(null);
      const uploads = await uploadProjectImagesAction(fd);
      const u = uploads[0];
      if (!u) throw new Error();
      setDraft((p) => ({ ...p, image: u.src, imageAlt: p.imageAlt.trim() || u.alt }));
      setUploadState('idle');
      setSelectedFileName(u.alt);
    } catch {
      setUploadState('error');
      setUploadError('Upload хийх үед алдаа гарлаа.');
    }
  };

  const saveModal = async () => {
    const data: Omit<ProjectItem, 'id'> = {
      title: draft.title.trim(),
      category: draft.category.trim(),
      year: draft.year.trim(),
      area: draft.area.trim(),
      image: draft.image.trim(),
      imageAlt: draft.imageAlt.trim(),
      tags: parseTags(tagsText),
    };
    if (!data.title || !data.category || !data.year || !data.image) {
      setFormError('Гарчиг, ангилал, он, зургийг заавал бөглөнө үү.');
      return;
    }
    if (modal?.mode === 'create') {
      const ok = await run('create', 'Төсөл нэмэгдлээ.', async () => {
        const item = await createProjectItemAction(data);
        setProjects((p) => [...p, item]);
      });
      if (ok) closeModal();
    } else if (modal?.mode === 'edit') {
      const id = modal.item.id;
      const ok = await run('edit', 'Төсөл шинэчлэгдлээ.', async () => {
        const item = await updateProjectItemAction(id, data);
        setProjects((p) => p.map((pr) => (pr.id === id ? item : pr)));
      });
      if (ok) closeModal();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const ok = await run('delete', 'Төсөл устгагдлаа.', async () => {
      await deleteProjectItemAction(id);
      setProjects((p) => p.filter((pr) => pr.id !== id));
    });
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <div className="p-6 border rounded-2xl border-white/5 bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-display font-700 text-foreground">Төслийн жагсаалт</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-badge">{projects.length} мөр</span>
            <button
              type="button"
              onClick={openCreate}
              className="btn-primary"
              disabled={isMutating}
            >
              Шинэ төсөл нэмэх
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Гарчиг', 'Ангилал', 'Он', 'Талбай', 'Зураг', 'Үйлдэл'].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 font-mono text-xs tracking-wider text-left uppercase text-muted-2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p, i) => (
                <tr key={p.id} className="hover:bg-surface-2">
                  <td className="px-3 py-3 font-mono text-xs text-muted">{i + 1}</td>
                  <td className="px-3 py-3 text-foreground max-w-[200px] truncate">{p.title}</td>
                  <td className="px-3 py-3 text-muted">{p.category}</td>
                  <td className="px-3 py-3 font-mono text-xs text-muted">{p.year}</td>
                  <td className="px-3 py-3 text-muted">{p.area}</td>
                  <td className="px-3 py-3">
                    {p.image && (
                      <div className="relative w-20 h-12 overflow-hidden border rounded-lg border-white/5">
                        <AppImage src={p.image} alt={p.imageAlt} fill className="object-cover" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="px-2 py-1 text-xs text-blue-200 border rounded-md border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20"
                        disabled={isMutating}
                      >
                        Засах
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        className="px-2 py-1 text-xs text-red-200 border rounded-md border-red-400/30 bg-red-400/10 hover:bg-red-400/20"
                        disabled={isMutating}
                      >
                        Устгах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-sm text-center text-muted">
                    Төсөл байхгүй байна.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ModalShell
          title={modal.mode === 'create' ? 'Шинэ төсөл' : 'Төсөл засах'}
          subtitle="Гарчиг, ангилал, он, зургийг бөглөнө үү."
          onClose={closeModal}
        >
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="p-5 border rounded-2xl border-white/5 bg-surface">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-2">Preview</p>
              <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/5">
                {draft.image ? (
                  <AppImage
                    src={draft.image}
                    alt={draft.imageAlt || 'Preview'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-3" />
                )}
              </div>
            </div>
            <div className="space-y-5">
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Гарчиг *
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                  <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                    Ангилал *
                  </label>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                  <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                    Он *
                  </label>
                  <input
                    type="text"
                    value={draft.year}
                    onChange={(e) => setDraft((p) => ({ ...p, year: e.target.value }))}
                    className="input-field"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Талбай
                </label>
                <input
                  type="text"
                  value={draft.area}
                  onChange={(e) => setDraft((p) => ({ ...p, area: e.target.value }))}
                  className="input-field"
                  placeholder="12,400 м²"
                />
              </div>
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Tags (мөр эсвэл comma)
                </label>
                <textarea
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  rows={3}
                  className="resize-none input-field"
                />
              </div>
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={draft.image}
                  onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Image Alt
                </label>
                <input
                  type="text"
                  value={draft.imageAlt}
                  onChange={(e) => setDraft((p) => ({ ...p, imageAlt: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Upload зураг
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setSelectedFileName(e.target.files?.[0]?.name ?? '');
                    setUploadError(null);
                  }}
                  className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:text-white"
                />
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => void handleUpload()}
                    className="btn-secondary"
                    disabled={uploadState === 'uploading' || isMutating}
                  >
                    {uploadState === 'uploading' ? 'Upload хийж байна...' : 'Upload'}
                  </button>
                  {selectedFileName && (
                    <span className="text-sm text-muted">{selectedFileName}</span>
                  )}
                </div>
                {uploadError && <p className="mt-2 text-sm text-red-300">{uploadError}</p>}
              </div>
            </div>
          </div>
          {formError && (
            <div className="px-4 py-3 mt-5 text-sm text-red-200 border rounded-xl border-red-400/30 bg-red-400/10">
              {formError}
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary"
              disabled={isMutating}
            >
              Болих
            </button>
            <button
              type="button"
              onClick={() => void saveModal()}
              className="btn-primary"
              disabled={isMutating}
            >
              {activeOp ? 'Хадгалж байна...' : modal.mode === 'create' ? 'Нэмэх' : 'Шинэчлэх'}
            </button>
          </div>
        </ModalShell>
      )}

      {deleteTarget && (
        <ModalShell
          title="Төсөл устгах"
          subtitle="Энэ үйлдэл буцаах боломжгүй."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="p-5 border rounded-2xl border-white/5 bg-surface">
            <p className="text-sm text-muted">
              Та{' '}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget.title}&rdquo;
              </span>{' '}
              төслийг устгахдаа итгэлтэй байна уу?
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
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
              className="rounded-lg border border-red-400/30 bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              disabled={isMutating}
            >
              {activeOp === 'delete' ? 'Устгаж байна...' : 'Устгах'}
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
}
