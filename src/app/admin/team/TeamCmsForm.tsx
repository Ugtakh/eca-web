'use client';

import { type ReactNode, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import AppImage from '@/components/ui/AppImage';
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  updateTeamMemberAction,
  uploadTeamImagesAction,
} from '@/lib/actions/team-section';
import { type TeamMember } from '@/lib/cms/team-section';

interface TeamCmsFormProps {
  initialMembers: TeamMember[];
}

type UploadState = 'idle' | 'uploading' | 'error';
type ModalMode = { mode: 'create' } | { mode: 'edit'; item: TeamMember } | null;

const AVAILABLE_CERTIFICATIONS = [
  'Автокад',
  'Инженерчлэл',
  'ҮПА',
  'Галын систем',
  'Үйлдвэрлэл',
  'Автомажуулалт',
  'ПЛС',
  'Скада',
  'ЛТД дизайн',
  'Эрчим хүч',
  'Сүлжээ',
  'Дата-центр',
];

function emptyDraft(): Omit<TeamMember, 'id'> {
  return { name: '', role: '', bio: '', image: '', imageAlt: '', certifications: [], linkedin: '' };
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

function CertMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [custom, setCustom] = useState('');
  const add = () => {
    const t = custom.trim();
    if (t && !selected.includes(t)) {
      onChange([...selected, t]);
      setCustom('');
    }
  };
  return (
    <div className="p-5 border rounded-2xl border-white/5 bg-surface">
      <p className="mb-4 font-mono text-xs tracking-widest uppercase text-muted-2">Мэргэшил</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {selected.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-accent/20 text-accent"
          >
            {c}
            <button
              type="button"
              onClick={() => onChange(selected.filter((x) => x !== c))}
              className="hover:opacity-70"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className="input-field"
          placeholder="Шинэ мэргэшил..."
        />
        <button type="button" onClick={add} className="px-4 btn-secondary">
          Нэмэх
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {AVAILABLE_CERTIFICATIONS.map((c) => (
          <label
            key={c}
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-surface-2"
          >
            <input
              type="checkbox"
              checked={selected.includes(c)}
              onChange={() =>
                onChange(selected.includes(c) ? selected.filter((x) => x !== c) : [...selected, c])
              }
              className="border rounded border-white/20"
            />
            <span className="text-sm text-foreground">{c}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function TeamCmsForm({ initialMembers }: TeamCmsFormProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [modal, setModal] = useState<ModalMode>(null);
  const [draft, setDraft] = useState<Omit<TeamMember, 'id'>>(emptyDraft());
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
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
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const openCreate = () => {
    setDraft(emptyDraft());
    setModal({ mode: 'create' });
    setUploadState('idle');
    setUploadError(null);
    setFormError(null);
    setSelectedFileName('');
  };
  const openEdit = (item: TeamMember) => {
    setDraft({
      name: item.name,
      role: item.role,
      bio: item.bio,
      image: item.image,
      imageAlt: item.imageAlt,
      certifications: item.certifications,
      linkedin: item.linkedin,
    });
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
      const uploads = await uploadTeamImagesAction(fd);
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
    const data: Omit<TeamMember, 'id'> = {
      name: draft.name.trim(),
      role: draft.role.trim(),
      bio: draft.bio.trim(),
      image: draft.image.trim(),
      imageAlt: draft.imageAlt.trim(),
      certifications: draft.certifications,
      linkedin: draft.linkedin.trim(),
    };
    if (!data.name || !data.role || !data.image) {
      setFormError('Нэр, албан тушаал, зургийг заавал бөглөнө үү.');
      return;
    }
    if (modal?.mode === 'create') {
      const ok = await run('create', 'Гишүүн нэмэгдлээ.', async () => {
        const item = await createTeamMemberAction(data);
        setMembers((p) => [...p, item]);
      });
      if (ok) closeModal();
    } else if (modal?.mode === 'edit') {
      const id = modal.item.id;
      const ok = await run('edit', 'Гишүүн шинэчлэгдлээ.', async () => {
        const item = await updateTeamMemberAction(id, data);
        setMembers((p) => p.map((m) => (m.id === id ? item : m)));
      });
      if (ok) closeModal();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const ok = await run('delete', 'Гишүүн устгагдлаа.', async () => {
      await deleteTeamMemberAction(id);
      setMembers((p) => p.filter((m) => m.id !== id));
    });
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <div className="p-6 border rounded-2xl border-white/5 bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-display font-700 text-foreground">Багийн гишүүд</h3>
            <p className="mt-1 text-sm text-muted">
              Нэр, албан тушаал, намтар, зураг, мэргэшлийг удирдана.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-badge">{members.length} гишүүн</span>
            <button
              type="button"
              onClick={openCreate}
              className="btn-primary"
              disabled={isMutating}
            >
              Гишүүн нэмэх
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="p-5 border rounded-2xl border-white/5 bg-surface-2">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-3 overflow-hidden border rounded-full border-white/10">
                  <AppImage src={m.image} alt={m.imageAlt} fill className="object-cover" />
                </div>
                <p className="text-base font-display font-700 text-foreground">{m.name}</p>
                <p className="mt-0.5 text-xs text-accent">{m.role}</p>
                <p className="mt-2 text-xs line-clamp-2 text-muted">{m.bio}</p>
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {m.certifications.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => openEdit(m)}
                    className="px-3 py-1 text-xs text-blue-200 border rounded-md border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20"
                    disabled={isMutating}
                  >
                    Засах
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(m)}
                    className="px-3 py-1 text-xs text-red-200 border rounded-md border-red-400/30 bg-red-400/10 hover:bg-red-400/20"
                    disabled={isMutating}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="col-span-3 py-10 text-sm text-center text-muted">Гишүүн байхгүй байна.</p>
          )}
        </div>
      </div>

      {modal && (
        <ModalShell
          title={modal.mode === 'create' ? 'Гишүүн нэмэх' : 'Гишүүн засах'}
          subtitle="Нэр, албан тушаал, зургийг бөглөнө үү."
          onClose={closeModal}
        >
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="p-5 border rounded-2xl border-white/5 bg-surface">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-2">Preview</p>
              <div className="relative mt-4 overflow-hidden border aspect-square rounded-xl border-white/5">
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
            <div className="space-y-4">
              {[
                { label: 'Нэр *', key: 'name', placeholder: '' },
                { label: 'Албан тушаал *', key: 'role', placeholder: '' },
                { label: 'LinkedIn', key: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="p-5 border rounded-2xl border-white/5 bg-surface">
                  <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={(draft as Record<string, unknown>)[key] as string}
                    onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))}
                    className="input-field"
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div className="p-5 border rounded-2xl border-white/5 bg-surface">
                <label className="block mb-2 font-mono text-xs tracking-wider uppercase text-muted-2">
                  Намтар
                </label>
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
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
          <CertMultiSelect
            selected={draft.certifications}
            onChange={(v) => setDraft((p) => ({ ...p, certifications: v }))}
          />
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
          title="Гишүүн устгах"
          subtitle="Энэ үйлдэл буцаах боломжгүй."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="p-5 border rounded-2xl border-white/5 bg-surface">
            <p className="text-sm text-muted">
              Та{' '}
              <span className="font-semibold text-foreground">
                &ldquo;{deleteTarget.name}&rdquo;
              </span>{' '}
              гишүүнийг устгахдаа итгэлтэй байна уу?
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
