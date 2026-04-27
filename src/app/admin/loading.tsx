import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-secondary" />
        <span>Админ хэсэг ачаалж байна...</span>
      </div>
    </div>
  );
}
