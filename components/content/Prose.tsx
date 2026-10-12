/* The body of an article, case study, webinar or news item.

   Content is plain text written in the admin, never HTML, so there is
   nothing to sanitise on the way out: every block becomes a React
   element and React escapes it. The format, kept deliberately small:

     a blank line          starts a new block
     ## Heading            a subheading
     ### Heading           a smaller subheading
     - item (each line)    a bulleted list
     anything else         a paragraph (single line breaks kept)

   The paragraph and "## " styles are the ones Insights always used,
   so existing posts render exactly as before. */
export function Prose({ blocks, className }: { blocks: string[]; className?: string }) {
  return (
    <div className={className ?? "mt-14 max-w-[64ch]"}>
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-10 text-[clamp(1.25rem,2vw,1.5rem)] leading-snug first:mt-0">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-12 text-[clamp(1.5rem,2.4vw,1.875rem)] leading-snug first:mt-0">
              {block.slice(3)}
            </h2>
          );
        }
        const rows = block.split("\n");
        if (rows.every((r) => /^\s*[-*•]\s+/.test(r))) {
          return (
            <ul key={i} className="mt-6 list-disc space-y-2 pl-6 text-[1.125rem] leading-[1.75] text-n-600 marker:text-accent">
              {rows.map((r, j) => (
                <li key={j}>{r.replace(/^\s*[-*•]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-6 text-[1.125rem] leading-[1.75] whitespace-pre-line text-n-600">
            {block}
          </p>
        );
      })}
    </div>
  );
}
