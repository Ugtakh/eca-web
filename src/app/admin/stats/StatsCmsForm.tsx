'use client';

import { type ReactNode, useState } from 'react';
import { toast } from 'react-toastify';

import { createStatItemAction, deleteStatItemAction, updateStatItemAction } from '@/lib/actions/stats-section';
import { type StatItem } from '@/lib/cms/stats-section';

interface StatsCmsFormProps {
  initialStats: StatItem[];
}

type ModalMode = { mode: 'create' } | { mode: 'edit'; item: StatItem } | null;

const COLOR_PRESETS = [
  { label: 'Orange', value: '#F97316' },
  { label: 'Blue', value: '#60A5FA' },
  { label: 'Green', value: '#4ADE80' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Purple', value: '#A78BFA' },
];

function toHex(v: string) {
  const t = v.trim();
  const m = /^#([0-9a-fA-F]{3})$/.exec(t);
  if (m) { const [r, g, b] = m[1].split(''); return `#${r}${r}${g}${g}${b}${b}`; }
  return /^#([0-9a-fA-F]{6})$/.test(t) ? t : '#60A5FA';
}

function emptyDraft(): Omit<StatItem, 'id'> {
  return { value: 0, suffix: '+', label: '', sublabel: '', color: '#60A5FA' };
}

function ModalShell({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
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

export default function StatsCmsForm({ initialStats }: StatsCmsFormProps) {
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [modal, setModal] = useState<ModalMode>(null);
  const [draft, setDraft] = useState<Omit<StatItem, 'id'>>(emptyDraft);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StatItem | null>(null);
  const [activeOp, setActiveOp] = useState<string | null>(null);

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

  const closeModal = () => { setModal(null); setDraft(emptyDraft()); setFormError(null); };

  const validate = () => {
    if (!draft.label.trim() || !draft.sublabel.trim() || !draft.suffix.trim()) {
      setFormError('Label, sublabel, suffix талбарыг бөглөнө үү.');
      return false;
    }
    return true;
  };

  const saveModal = async () => {
    if (!validate()) return;
    if (modal?.mode === 'create') {
      const ok = await run('create', 'Stat нэмэгдлээ.', async () => {
        const item = await createStatItemAction(draft);
        setStats((p) => [...p, item]);
      });
      if (ok) closeModal();
    } else if (modal?.mode === 'edit') {
      const id = modal.item.id;
      const ok = await run('edit', 'Stat шинэчлэгдлээ.', async () => {
        const item = await updateStatItemAction(id, draft);
        setStats((p) => p.map((s) => s.id === id ? item : s));
      });
      if (ok) closeModal();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const ok = await run('delete', 'Stat устгагдлаа.', async () => {
      await deleteStatItemAction(id);
      setStats((p) => p.filter((s) => s.id !== id));
    });
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-white/5 bg-surface p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-700 text-foreground">Statistics Items</h3>
            <p className="mt-1 text-sm text-muted">Value, suffix, label, sublabel, color утгуудыг удирдана.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-badge">{stats.length} мөр</span>
            <button type="button" onClick={() => { setDraft(emptyDraft()); setModal({ mode: 'create' }); setFormError(null); }} className="btn-primary" disabled={isMutating}>Шинэ мөр нэмэх</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Value', 'Suffix', 'Label', 'Sublabel', 'Preview', 'Үйлдэл'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.map((stat, i) => (
                <tr key={stat.id} className="hover:bg-surface-2">
                  <td className="px-3 py-3 font-mono text-xs text-muted">{i + 1}</td>
                  <td className="px-3 py-3 text-foreground">{stat.value}</td>
                  <td className="px-3 py-3 text-muted">{stat.suffix}</td>
                  <td className="px-3 py-3 text-foreground">{stat.label}</td>
                  <td className="px-3 py-3 text-muted">{stat.sublabel}</td>
                  <td className="px-3 py-3"><span style={{ color: stat.color }} className="font-display text-lg font-800">{stat.value}{stat.suffix}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setDraft({ value: stat.value, suffix: stat.suffix, label: stat.label, sublabel: stat.sublabel, color: stat.color }); setModal({ mode: 'edit', item: stat }); setFormError(null); }} className="rounded-md border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-xs text-blue-200 hover:bg-blue-400/20" disabled={isMutating}>Засах</button>
                      <button type="button" onClick={() => setDeleteTarget(stat)} className="rounded-md border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs text-red-200 hover:bg-red-400/20" disabled={isMutating}>Устгах</button>
                    </div>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && <tr><td colSpan={7} className="px-3 py-10 text-center text-sm text-muted">Stat мөр байхгүй байна.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ModalShell title={modal.mode === 'create' ? 'Шинэ Stat' : 'Stat засах'} subtitle="Value, suffix, label, sublabel, color талбаруудыг бөглөнө." onClose={closeModal}>
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Value</label>
              <input type="number" min={0} value={draft.value} onChange={(e) => setDraft((p) => ({ ...p, value: Number(e.target.value || 0) }))} className="input-field" />
            </div>
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Suffix</label>
              <input type="text" value={draft.suffix} onChange={(e) => setDraft((p) => ({ ...p, suffix: e.target.value }))} className="input-field" placeholder="+, %, /7 ..." />
            </div>
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Label *</label>
              <input type="text" value={draft.label} onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))} className="input-field" />
            </div>
            <div className="rounded-2xl border border-white/5 bg-surface p-5">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-muted-2">Sublabel *</label>
              <input type="text" value={draft.sublabel} onChange={(e) => setDraft((p) => ({ ...p, sublabel: e.target.value }))} className="input-field" />
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
          {formError && <div className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{formError}</div>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="btn-secondary" disabled={isMutating}>Болих</button>
            <button type="button" onClick={() => void saveModal()} className="btn-primary" disabled={isMutating}>{activeOp ? 'Хадгалж байна...' : modal.mode === 'create' ? 'Нэмэх' : 'Шинэчлэх'}</button>
          </div>
        </ModalShell>
      )}

      {deleteTarget && (
        <ModalShell title="Stat устгах" subtitle="Энэ үйлдэл буцаах боломжгүй." onClose={() => setDeleteTarget(null)}>
          <div className="rounded-2xl border border-white/5 bg-surface p-5">
            <p className="text-sm text-muted">Та <span className="font-semibold text-foreground">&ldquo;{deleteTarget.label}&rdquo;</span> мөрийг устгахдаа итгэлтэй байна уу?</p>
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
