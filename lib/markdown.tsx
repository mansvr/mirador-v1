import type { ReactNode } from "react";

/**
 * Tiny, dependency-free, XSS-safe Markdown renderer for listing bodies.
 *
 * Supports the subset we use in `listing.story_md` / `description_md`:
 *   - paragraphs (blank-line separated); single newlines become <br/>
 *   - `##` / `###` headings
 *   - `- ` unordered lists
 *   - inline **bold**, *italic*, `code`, [text](https://url)
 *
 * Safe because output is built from React elements (text is auto-escaped) and
 * link hrefs are restricted to http(s). No raw HTML is ever injected.
 */

const INLINE = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `${keyPrefix}-i${i++}`;
    if (match[1]) {
      const href = match[3];
      const safe = /^https?:\/\//i.test(href) ? href : undefined;
      nodes.push(
        safe ? (
          <a
            key={key}
            href={safe}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mirador-text underline underline-offset-2 hover:opacity-80"
          >
            {match[2]}
          </a>
        ) : (
          match[2]
        ),
      );
    } else if (match[4]) {
      nodes.push(<strong key={key} className="font-medium text-mirador-text">{match[5]}</strong>);
    } else if (match[6]) {
      nodes.push(<em key={key}>{match[7]}</em>);
    } else if (match[8]) {
      nodes.push(
        <code key={key} className="rounded bg-mirador-border/40 px-1 py-0.5 text-[0.85em]">
          {match[9]}
        </code>,
      );
    }
    lastIndex = INLINE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function withBreaks(lines: string[], keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  lines.forEach((line, idx) => {
    if (idx > 0) out.push(<br key={`${keyPrefix}-br${idx}`} />);
    out.push(...renderInline(line, `${keyPrefix}-l${idx}`));
  });
  return out;
}

export function renderMarkdown(md: string): ReactNode[] {
  const blocks = md.trim().split(/\n\s*\n/);
  return blocks.map((block, bi) => {
    const key = `md-b${bi}`;
    const lines = block.split("\n");

    if (block.startsWith("### ")) {
      return (
        <h3 key={key} className="mt-5 text-base font-medium tracking-tight text-mirador-text">
          {renderInline(block.slice(4), key)}
        </h3>
      );
    }
    if (block.startsWith("## ")) {
      return (
        <h2 key={key} className="mt-6 text-lg font-medium tracking-tight text-mirador-text">
          {renderInline(block.slice(3), key)}
        </h2>
      );
    }
    if (block.startsWith("# ")) {
      return (
        <h2
          key={key}
          className="text-lg font-medium tracking-tight text-mirador-text sm:text-xl"
        >
          {renderInline(block.slice(2), key)}
        </h2>
      );
    }
    if (lines.every((l) => l.trimStart().startsWith("- "))) {
      return (
        <ul key={key} className="my-2 list-disc space-y-1 pl-5">
          {lines.map((l, li) => (
            <li key={`${key}-li${li}`}>{renderInline(l.trimStart().slice(2), `${key}-li${li}`)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={key} className="leading-relaxed">
        {withBreaks(lines, key)}
      </p>
    );
  });
}
