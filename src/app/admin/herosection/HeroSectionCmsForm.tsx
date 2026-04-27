'use client';

import { type ReactNode, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import AppImage from '@/components/ui/AppImage';
import {
  createHeroSlideAction,
  deleteHeroSlideAction,
  updateHeroSlideAction,
  updateHeroRotationAction,
  uploadHeroSectionImagesAction,
} from '@/lib/actions/hero-section';
import {
  defaultHeroSectionContent,
  type HeroSectionContent,
  type HeroSectionSlide,
} from '@/lib/cms/hero-section';

interface HeroSectionCmsFormProps {
  initialContent: HeroSectionContent;
}

type UploadState = 'idle' | 'uploading' | 'error';
type ModalMode = { mode: 'create' } | { mode: 'edit'; slide: HeroSectionSlide } | null;

function emptyDraft(): Omit<HeroSectionSlide, 'id'> {
  return { title: '', subtitle: '', description: '', bannerText: '', image: { src: '', alt: '' } };
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

export default function HeroSectionCmsForm({ initialContent }: HeroSectionCmsFormProps) {
  const [slides, setSlides] = useState<HeroSectionSlide[]>(initialContent.slides);
  const [rotation, setRotation] = useState(initialContent.rotationSeconds);
  const [modal, setModal] = useState<ModalMode>(null);
  const [draft, setDraft] = useState<Omit<HeroSectionSlide, 'id'>>(emptyDraft);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeroSectionSlide | null>(null);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const fallback = defaultHeroSectionContent.slides[0].image;
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
    setModal(null); setDraft(emptyDraft()); setUploadState('idle');
    setUploadError(null); setFormError(null); setSelectedFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const openCreate = () => { setDraft(emptyDraft()); setModal({ mode: 'create' }); setUploadState('idle'); setUploadError(null); setFormError(null); setSelectedFileName(''); };
  const openEdit = (slide: HeroSectionSlide) => { setDraft({ title: slide.title, subtitle: slide.subtitle, description: slide.description, bannerText: slide.bannerText, image: { src: slide.image.src, alt: slide.image.alt } }); setModal({ mode: 'edit', slide }); setUploadState('idle'); setUploadError(null); setFormError(null); setSelectedFileName(''); };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setUploadError('Файл сонгоно уу.'); return; }
    const fd = new FormData(); fd.append('files', file);
    try {
      setUploadState('uploading'); setUploadError(null);
      const uploads = await uploadHeroSectionImagesAction(fd);
      const u = uploads[0]; if (!u) throw new Error();
      setDraft((p) => ({ ...p, image: { src: u.src, alt: p.image.alt.trim() || u.alt } }));
      setUploadState('idle'); setSelectedFileName(u.alt);
    } catch { setUploadState('error'); setUploadError('Upload хийх үед алдаа гарлаа.'); }
  };

  const saveModal = async () => {
    const data: Omit<HeroSectionSlide, 'id'> = { title: draft.title.trim(), subtitle: draft.subtitle.trim(), description: draft.description.trim(), bannerText: draft.bannerText.trim(), image: { src: draft.image.src.trim(), alt: draft.image.alt.trim() } };
    if (!data.title || !data.subtitle || !data.description || !data.bannerText || !data.image.src || !data.image.alt) { setFormError('Бүх талбарыг бүрэн бөглөнө үү.'); return; }
    if (modal?.mode === 'create') {
      const ok = await run('create', 'Slide нэмэгдлээ.', async () => { const slide = await createHeroSlideAction(data, rotation); setSlides((p) => [...p, slide]); });
      if (ok) closeModal();
    } else if (modal?.mode === 'edit') {
      const id = modal.slide.id;
      const ok = await run('edit', 'Slide шинэчлэгдлээ.', async () => { const slide = await updateHeroSlideAction(id, data, rotation); setSlides((p) => p.map((s) => s.id === id ? slide : s)); });
      if (ok) closeModal();
    }
  };

  const saveRotation = async () => {
    await run('rotation', 'Rotation хадгалагдлаа.', async () => { await updateHeroRotationAction(rotation); });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const ok = await run('delete', 'Slide устгагдлаа.', async () => { await deleteHeroSlideAction(id); setSlides((p) => p.filter((s) => s.id !== id)); });
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Rotation config */}
        <div className="rounded-2xl border border-white/5 bg-surface p-6">
          <h3 className="font-display text-xl font-700 text-foreground mb-1">Rotation Speed</h3>
          <p className="text-sm text-muted mb-4">Slide солигдох хугацаа (секунд).</p>
          <div className="flex items-center gap-4">
            <input type="number" min={1} max={10} value={rotation} onChange={(e) => setRotation(Math.max(1, Math.min(10, Number(e.target.value || 4))))} className="input-field w-24" />
            <button type="button" onClick={() => void saveRotation()} className="btn-secondary" disabled={isMutating}>{activeOp === 'rotation' ? 'Хадгалж байна...' : 'Хадгалах'}</button>
          </div>
        </div>

        {/* Slides */}
        <div className="rounded-2xl border border-white/5 bg-surface p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-700 text-foreground">Hero Slides</h3>
              <p className="mt-1 text-sm text-muted">Title, subtitle, description, banner text болон зурагтай slides.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="tag-badge">{slides.length} slide</span>
              <button type="button" onClick={openCreate} className="btn-primary" disabled={isMutating}>Шинэ slide нэмэх</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['#', 'Title', 'Subtitle', 'Description', 'Зураг', 'Үйлдэл'].map((h) => (
                    <th key={h} className="px-3 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {slides.map((slide, i) => (
                  <tr key={slide.id} className="hover:bg-surface-2">
                    <td className="px-3 py-3 font-mono text-xs text-muted">{i + 1}</td>
                    <td className="px-3 py-3 text-foreground max-w-[180px] truncate">{slide.title}</td>
                    <td className="px-3 py-3 text-muted">{slide.subtitle}</td>
                    <td className="px-3 py-3 text-muted"><span className="inline-block max-w-[220px] truncate">{slide.description}</span></td>
                    <td className="px-3 py-3"><div className="relative h-14 w-24 overflow-hidden rounded-lg border border-white/5"><AppImage src={slide.image.src} alt={slide.image.alt} fill className="object-cover" /></div></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(slide)} className="rounded-md border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-xs text-blue-200 hover:bg-blue-400/20" disabled={isMutating}>Засах</button>
                        <button type="button" onClick={() => setDeleteTarget(slide)} className="rounded-md border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs text-red-200 hover:bg-red-400/20" disabled={isMutating}>Устгах</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {slides.length === 0 && <tr><td colSpan={6} className="px-3 py-10 text-center text-sm text-muted">Slide байхгүй байна.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <ModalShell title={modal.mode === 'create' ? 'Шинэ Hero Slide' : 'Hero Slide засах'} subtitle="Бүх талбарыг бөглөнө үү." onClose={closeModal}>
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-2">Preview</p>
              <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/5">
                <AppImage src={draft.image.src || fallback.src} alt={draft.image.alt || fallback.alt} fill className="object-cover" />
              </div>
              <p className="mt-3 text-xs text-muted-2">{draft.image.src ? 'Custom зураг сонгогдсон' : 'Preview fallback зураг'}</p>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Hero Title *</label>
                <textarea value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} rows={4} className="input-field resize-none" placeholder="Мөр эвдэх: Enter дар" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Subtitle *</label>
                <input type="text" value={draft.subtitle} onChange={(e) => setDraft((p) => ({ ...p, subtitle: e.target.value }))} className="input-field" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Description *</label>
                <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} rows={4} className="input-field resize-none" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Banner Text *</label>
                <input type="text" value={draft.bannerText} onChange={(e) => setDraft((p) => ({ ...p, bannerText: e.target.value }))} className="input-field" placeholder="10+ жилийн туршлага · 50+ дууссан төсөл" />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Image URL *</label>
                <input type="text" value={draft.image.src} onChange={(e) => setDraft((p) => ({ ...p, image: { ...p.image, src: e.target.value } }))} className="input-field" placeholder="https://..." />
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-5">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Image Alt *</label>
                <input type="text" value={draft.image.alt} onChange={(e) => setDraft((p) => ({ ...p, image: { ...p.image, alt: e.target.value } }))} className="input-field" />
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
        <ModalShell title="Slide устгах" subtitle="Энэ үйлдэл буцаах боломжгүй." onClose={() => setDeleteTarget(null)}>
          <div className="rounded-2xl border border-white/5 bg-surface p-5">
            <p className="text-sm text-muted">Та <span className="font-semibold text-foreground">&ldquo;{deleteTarget.title}&rdquo;</span> slide-ийг устгахдаа итгэлтэй байна уу?</p>
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
