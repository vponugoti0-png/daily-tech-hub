export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{body}</p>
    </div>
  );
}
