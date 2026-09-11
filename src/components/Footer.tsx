import Link from "next/link";

export function Footer({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#05080e]/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-zinc-300">Daily Tech Hub <span className="text-cyan-400">v2</span></p>
          <p className="mt-1">Snowflake · Databricks · Python · SQL · Shortcuts & AI</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          {lastUpdated ? <p>Digest updated {lastUpdated}</p> : null}
          <p>
            <Link href="/shortcuts" className="text-zinc-400 hover:text-cyan-300">
              Shortcuts
            </Link>
            {" · "}
            <Link href="/training" className="text-zinc-400 hover:text-cyan-300">
              Training
            </Link>
            {" · "}
            <span>npm run refresh:daily</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
