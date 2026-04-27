'use client';

import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

import { uploadNewsImageAction } from '@/lib/actions/news';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

type ImgPanelState = 'closed' | 'url' | 'upload';

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [imgPanel, setImgPanel] = useState<ImgPanelState>('closed');
  const [imgUrl, setImgUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image.configure({ inline: false, allowBase64: false })],
    content,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[280px] p-4 focus:outline-none prose prose-invert prose-sm max-w-none text-foreground',
      },
    },
  });

  const insertImageUrl = () => {
    const url = imgUrl.trim();
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
    setImgUrl('');
    setImgPanel('closed');
  };

  const handleFileUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('files', file);
    try {
      setUploading(true);
      setUploadError(null);
      const uploads = await uploadNewsImageAction(formData);
      const uploaded = uploads[0];
      if (!uploaded) throw new Error('Upload response хоосон');
      editor?.chain().focus().setImage({ src: uploaded.src, alt: uploaded.alt }).run();
      setImgPanel('closed');
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setUploadError('Upload хийх үед алдаа гарлаа.');
    } finally {
      setUploading(false);
    }
  };

  const toolbarBtn = (
    label: string,
    title: string,
    action: () => void,
    active: boolean,
    className = ''
  ) => (
    <button
      key={title}
      type="button"
      title={title}
      onClick={action}
      className={`rounded-md px-2.5 py-1 text-sm transition-colors ${className} ${
        active
          ? 'bg-accent/20 text-accent border border-accent/30'
          : 'text-muted hover:bg-surface-3 hover:text-foreground border border-transparent'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-surface-2 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 bg-surface p-2">
        {toolbarBtn('B', 'Bold', () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold') ?? false, 'font-bold')}
        {toolbarBtn('I', 'Italic', () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic') ?? false, 'italic')}
        {toolbarBtn('H1', 'Heading 1', () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), editor?.isActive('heading', { level: 1 }) ?? false, 'font-bold text-xs')}
        {toolbarBtn('H2', 'Heading 2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editor?.isActive('heading', { level: 2 }) ?? false, 'font-bold text-xs')}
        {toolbarBtn('H3', 'Heading 3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), editor?.isActive('heading', { level: 3 }) ?? false, 'font-bold text-xs')}
        {toolbarBtn('• List', 'Bullet List', () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive('bulletList') ?? false, 'text-xs')}
        {toolbarBtn('1. List', 'Ordered List', () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive('orderedList') ?? false, 'text-xs')}
        {toolbarBtn('❝', 'Blockquote', () => editor?.chain().focus().toggleBlockquote().run(), editor?.isActive('blockquote') ?? false)}
        {toolbarBtn('—', 'Horizontal Rule', () => editor?.chain().focus().setHorizontalRule().run(), false)}

        {/* Image button */}
        <div className="relative">
          <button
            type="button"
            title="Зураг оруулах"
            onClick={() => setImgPanel((s) => (s === 'closed' ? 'url' : 'closed'))}
            className={`rounded-md px-2.5 py-1 text-sm transition-colors border ${
              imgPanel !== 'closed'
                ? 'bg-accent/20 text-accent border-accent/30'
                : 'text-muted hover:bg-surface-3 hover:text-foreground border-transparent'
            }`}
          >
            🖼 Зураг
          </button>

          {imgPanel !== 'closed' && (
            <div className="absolute left-0 top-full z-30 mt-1 w-72 rounded-xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
              {/* Tabs */}
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setImgPanel('url')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${imgPanel === 'url' ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'}`}
                >
                  URL-аар
                </button>
                <button
                  type="button"
                  onClick={() => setImgPanel('upload')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${imgPanel === 'upload' ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'}`}
                >
                  Upload
                </button>
              </div>

              {imgPanel === 'url' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && insertImageUrl()}
                    placeholder="https://..."
                    className="input-field text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={insertImageUrl}
                    className="btn-primary w-full text-sm"
                    disabled={!imgUrl.trim()}
                  >
                    Оруулах
                  </button>
                </div>
              )}

              {imgPanel === 'upload' && (
                <div className="space-y-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => void handleFileUpload()}
                    className="btn-primary w-full text-sm"
                    disabled={uploading}
                  >
                    {uploading ? 'Upload хийж байна...' : 'Upload & Оруулах'}
                  </button>
                  {uploadError && <p className="text-xs text-red-300">{uploadError}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex gap-1">
          <button
            type="button"
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            className="rounded-md px-2.5 py-1 text-sm text-muted hover:bg-surface-3 hover:text-foreground border border-transparent disabled:opacity-30"
          >
            ↩
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            className="rounded-md px-2.5 py-1 text-sm text-muted hover:bg-surface-3 hover:text-foreground border border-transparent disabled:opacity-30"
          >
            ↪
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
