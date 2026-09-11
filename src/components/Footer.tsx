import Link from "next/link";

export function Footer({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <footer className="mt-auto border-t border-[var(--ink-border)] bg-[color-mix(in_oklab,var(--canvas)_92%,#000)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display font-semibold text-[var(--ink-fg)]">
            Daily Tech Hub <span className="text-[var(--coral)]">v3</span>
          </p>
          <p className="mt-1">100% free forever · Aurora Play Lab · DE + AI niche</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          {lastUpdated ? <p>Digest updated {lastUpdated}</p> : null}
          <p>
            <Link href="/signup" className="hover:text-[var(--coral)]">
              Free signup
            </Link>
            {" · "}
            <Link href="/shortcuts" className="hover:text-[var(--sky)]">
              Shortcuts
            </Link>
            {" · "}
            <Link href="/training" className="hover:text-[var(--mint)]">
              Training
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
