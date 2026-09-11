import Link from "next/link";

export function Footer({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#05080e]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-zinc-400">Daily Tech Hub</p>
          <p className="mt-1">Personal digest for Snowflake · Databricks · Python · PySpark</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          {lastUpdated ? <p>Digest updated {lastUpdated}</p> : null}
          <p>
            <Link href="/search" className="text-zinc-400 hover:text-cyan-300">
              Search content
            </Link>
            {" · "}
            <span>Run `npm run refresh:daily` to roll the digest</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
