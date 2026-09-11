import { markdownToHtml } from "@/lib/markdown";

export async function Markdown({ source }: { source: string }) {
  const html = await markdownToHtml(source);
  return (
    <div
      className="prose-de max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
