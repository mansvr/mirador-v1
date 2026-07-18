import { renderMarkdown } from "@/lib/markdown";

interface CaseStudyBodyProps {
  /** Markdown body — from `listing.story_md`. */
  storyMd?: string;
  /** Fallback heading when the body doesn't carry its own #/##/### title. */
  heading?: string;
}

/**
 * Rich case-study / blog-style body for the `/v` page. Renders `listing.story_md`
 * as Markdown. Returns null when there's no body, so the section stays optional
 * per scene. If the story starts with its own Markdown heading, we suppress the
 * fallback heading to avoid a double title.
 */
export function CaseStudyBody({ storyMd, heading = "Sobre el espacio" }: CaseStudyBodyProps) {
  const body = storyMd?.trim();
  if (!body) return null;

  const startsWithHeading = /^#{1,3}\s/.test(body);

  return (
    <section
      aria-label={startsWithHeading ? "Caso de estudio" : heading}
      className="rounded-xl border border-mirador-border bg-mirador-surface p-5 shadow-sm sm:p-6 md:p-8"
    >
      {!startsWithHeading && (
        <h2 className="mb-3 text-lg font-medium tracking-tight text-mirador-text sm:text-xl">
          {heading}
        </h2>
      )}
      <div className="space-y-3 text-sm text-mirador-text-muted sm:text-[0.95rem]">
        {renderMarkdown(body)}
      </div>
    </section>
  );
}
