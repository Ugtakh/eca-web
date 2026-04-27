'use client';

import { type ReactNode, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import AppImage from '@/components/ui/AppImage';
import { createServiceItemAction, deleteServiceItemAction, updateServiceItemAction, uploadServiceImagesAction } from '@/lib/actions/services-section';
import { defaultServicesSectionContent, type ServiceItem } from '@/lib/cms/services-section';

interface ServicesCmsFormProps {
  initialServices: ServiceItem[];
}

type UploadState = 'idle' | 'uploading' | 'error';
type ModalMode = { mode: 'create' } | { mode: 'edit'; item: ServiceItem } | null;

const COLOR_PRESETS = [
  { label: 'Orange', value: '#E8390E' },
  { label: 'Blue', value: '#60A5FA' },
  { label: 'Amber', value: '#F5A623' },
  { label: 'Green', value: '#4ADE80' },
  { label: 'Purple', value: '#A78BFA' },
];

function toHex(v: string) {
  const t = v.trim();
  const m = /^#([0-9a-fA-F]{3})$/.exec(t);
  if (m) { const [r, g, b] = m[1].split(''); return `#${r}${r}${g}${g}${b}${b}`; }
  return /^#([0-9a-fA-F]{6})$/.test(t) ? t : '#60A5FA';
}

function featuresToText(f: string[]) { return f.join('\n'); }
function parseFeatures(s: string) { return s.split(/\n|,/).map((f) => f.trim()).filter(Boolean); }

function emptyDraft(): Omit<ServiceItem, 'id'> {
  return { title: '', subtitle: '', description: '', features: [], image: '', imageAlt: '', color: '#60A5FA' };
}

function ModalShell({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mt-1 font-display text-2xl font-700 text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted hover:text-foreground">×</button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default function ServicesCmsForm({ initialServices }: ServicesCmsFormProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [modal, setModal] = useState<ModalMode>(null);
  const [draft, setDraft] = useState<Omit<ServiceItem, 'id'>>(emptyDraft);
  const [featuresText, setFeaturesText] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const fallbackImage = defaultServicesSectionContent.services[0].image;
  const isMutating = activeOp !== null;

  const run = async (key: string, msg: string, task: () => Promise<void>) => {
    const tid = toast.loading('Хадгалж байна...');
    try {
      setActiveOp(key);
      await task();
      toast.update(tid, { render: msg, type: 'success', isLoading: false, autoClose: 2200, closeOnClick: true });
      return true;
    } catch {
      toast.update(tid, { render: 'Алдаа гарлаа.', type: 'error', isLoading: false, autoClose: 3200, closeOnClick: true });
      return false;
    } finally { setActiveOp(null); }
  };

  const closeModal = () => {
    setModal(null); setDraft(emptyDraft()); setFeaturesText('');
    setUploadState('idle'); setUploadError(null); setFormError(null); setSelectedFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const openCreate = () => { setDraft(emptyDraft()); setFeaturesText(''); setModal({ mode: 'create' }); setUploadState('idle'); setUploadError(null); setFormError(null); setSelectedFileName(''); };
  const openEdit = (item: ServiceItem) => { setDraft({ title: item.title, subtitle: item.subtitle, description: item.description, features: item.features, image: item.image, imageAlt: item.imageAlt, color: item.color }); setFeaturesText(featuresToText(item.features)); setModal({ mode: 'edit', item }); setUploadState('idle'); setUploadError(null); setFormError(null); setSelectedFileName(''); };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setUploadError('Файл сонгоно уу.'); return; }
    const fd = new FormData(); fd.append('files', file);
    try {
      setUploadState('uploading'); setUploadError(null);
      const uploads = await uploadServiceImagesAction(fd);
      const u = uploads[0]; if (!u) throw new Error();
      setDraft((p) => ({ ...p, image: u.src, imageAlt: p.imageAlt.trim() || u.alt }));
      setUploadState('idle'); setSelectedFileName(u.alt);
    } catch { setUploadState('error'); setUploadError('Upload хийх үед алдаа гарлаа.'); }
  };

  const saveModal = async () => {
    const data: Omit<ServiceItem, 'id'> = { title: draft.title.trim(), subtitle: draft.subtitle.trim(), description: draft.description.trim(), features: parseFeatures(featuresText), image: draft.image.trim(), imageAlt: draft.imageAlt.trim(), color: draft.color.trim() };
    if (!data.title || !data.subtitle || !data.description || data.features.length === 0 || !data.image || !data.imageAlt || !data.color) { setFormError('Бүх талбарыг бүрэн бөглөнө үү.'); return; }
    if (modal?.mode === 'create') {
      const ok = await run('create', 'Service нэмэгдлээ.', async () => { const item = await createServiceItemAction(data); setServices((p) => [...p, item]); });
      if (ok) closeModal();
    } else if (modal?.mode === 'edit') {
      const id = modal.item.id;
      const ok = await run('edit', 'Service шинэчлэгдлээ.', async () => { const item = await updateServiceItemAction(id, data); setServices((p) => p.map((s) => s.id === id ? item : s)); });
      if (ok) closeModal();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const ok = await run('delete', 'Service устгагдлаа.', async () => { await deleteServiceItemAction(id); setServices((p) => p.filter((s) => s.id !== id)); });
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-white/5 bg-surface p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-700 text-foreground">Services Items</h3>
            <p className="mt-1 text-sm text-muted">Title, subtitle, description, features, image, color талбаруудыг мөрөөр удирдана.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-badge">{services.length} мөр</span>
            <button type="button" onClick={openCreate} className="btn-primary" disabled={isMutating}>Шинэ мөр нэмэх</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Title', 'Subtitle', 'Features', 'Image', 'Color', 'Үйлдэл'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((s, i) => (
                <tr key={s.id} className="hover:bg-surface-2">
                  <td className="px-3 py-3 font-mono text-xs text-muted">{i + 1}</td>
                  <td className="px-3 py-3 text-foreground">{s.title}</td>
                  <td className="px-3 py-3 text-muted">{s.subtitle}</td>
                  <td className="px-3 py-3 text-muted">{s.features.length} feature</td>
                  <td className="px-3 py-3">
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-white/5">
                      <AppImage src={s.image} alt={s.imageAlt} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-surface-2 px-2 py-1 text-xs text-muted">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: toHex(s.color) }} />{s.color}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(s)} className="rounded-md border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-xs text-blue-200 hover:bg-blue-400/20" disabled={isMutating}>Засах</button>
                      <button type="button" onClick={() => setDeleteTarget(s)} className="rounded-md border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs text-red-200 hover:bg-red-400/20" disabled={isMutating}>Устгах</button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && <tr><td colSpan={7} className="px-3 py-10 text-center text-sm text-muted">Service мөр байхгүй байна.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ModalShell title={modal.mode === 'create' ? 'Шинэ Service' : 'Service засах'} subtitle="Бүх талбарыг бөглөнө үү." onClose={closeModal}>
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-2">Preview</p>
              <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/5">
                <AppImage src={draft.image || fallbackImage} alt={draft.imageAlt || 'Preview'} fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Title *', key: 'title' as const },
                { label: 'Subtitle *', key: 'subtitle' as const },
              ].map(({ label, key }) => (
                <div key={key} className="rounded-2xl border border-white/5 bg-surface p-5">
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">{label}</label>
                  <input type="text" value={draft[key] as string} onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))} className="input-field" />
                </div>
              ))}
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Description *</label>
                <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} rows={4} className="input-field resize-none" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Features * (мөр эсвэл comma)</label>
                <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} className="input-field resize-none" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Image URL *</label>
                <input type="text" value={draft.image} onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))} className="input-field" placeholder="https://..." />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Image Alt *</label>
                <input type="text" value={draft.imageAlt} onChange={(e) => setDraft((p) => ({ ...p, imageAlt: e.target.value }))} className="input-field" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Upload зураг</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { setSelectedFileName(e.target.files?.[0]?.name ?? ''); setUploadError(null); }} className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:text-white" />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => void handleUpload()} className="btn-secondary" disabled={uploadState === 'uploading' || isMutating}>{uploadState === 'uploading' ? 'Upload хийж байна...' : 'Upload'}</button>
                  {selectedFileName && <span className="text-sm text-muted">{selectedFileName}</span>}
                </div>
                {uploadError && <p className="mt-2 text-sm text-red-300">{uploadError}</p>}
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={toHex(draft.color)} onChange={(e) => setDraft((p) => ({ ...p, color: e.target.value }))} className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1" />
                  <input type="text" value={draft.color} onChange={(e) => setDraft((p) => ({ ...p, color: e.target.value }))} className="input-field" placeholder="#60A5FA" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button key={p.value} type="button" onClick={() => setDraft((prev) => ({ ...prev, color: p.value }))} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface-2 px-2.5 py-1.5 text-xs text-muted hover:text-foreground">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.value }} />{p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {formError && <div className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{formError}</div>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="btn-secondary" disabled={isMutating}>Болих</button>
            <button type="button" onClick={() => void saveModal()} className="btn-primary" disabled={isMutating}>{activeOp ? 'Хадгалж байна...' : modal.mode === 'create' ? 'Нэмэх' : 'Шинэчлэх'}</button>
          </div>
        </ModalShell>
      )}

      {deleteTarget && (
        <ModalShell title="Service устгах" subtitle="Энэ үйлдэл буцаах боломжгүй." onClose={() => setDeleteTarget(null)}>
          <div className="rounded-2xl border border-white/5 bg-surface p-5">
            <p className="text-sm text-muted">Та <span className="font-semibold text-foreground">&ldquo;{deleteTarget.title}&rdquo;</span> мөрийг устгахдаа итгэлтэй байна уу?</p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-secondary" disabled={isMutating}>Болих</button>
            <button type="button" onClick={() => void confirmDelete()} className="rounded-lg border border-red-400/30 bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50" disabled={isMutating}>{activeOp === 'delete' ? 'Устгаж байна...' : 'Устгах'}</button>
          </div>
        </ModalShell>
      )}
    </>
  );
}
