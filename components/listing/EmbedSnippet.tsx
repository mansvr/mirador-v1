"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { trackEmbedCopied } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface EmbedSnippetProps {
  sceneId: string;
  /** Must come from the server (e.g. getSiteUrl()) so SSR matches hydration. */
  siteUrl: string;
  /** Desktop overlay: iframe snippet + copy only (no QR block). */
  compact?: boolean;
  /** Tour page secondary card (padding matches PropertyStrip). */
  variant?: "default" | "card";
  /** Tour page: collapsible panel, closed by default. */
  collapsible?: boolean;
}

export function EmbedSnippet({
  sceneId,
  siteUrl,
  compact = false,
  variant = "default",
  collapsible = false,
}: EmbedSnippetProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const origin = siteUrl.replace(/\/$/, "");
  const snippet = `<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:min(85dvh,900px);min-height:200px"><iframe src="${origin}/e/${sceneId}" title="Mirador" style="position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:12px;display:block" allowfullscreen loading="lazy"></iframe></div>`;
  const tourUrl = `${origin}/v/${sceneId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(tourUrl)}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    trackEmbedCopied(sceneId);
    setTimeout(() => setCopied(false), 2000);
  }

  if (compact) {
    return (
      <div>
        <p className="mb-2 text-[10px] text-white/40">
          Tour{" "}
          <span className="text-white/60">/v/{sceneId}</span>
          {" · iframe "}
          <span className="text-white/60">/e/{sceneId}</span>
        </p>
        <div className="flex gap-2 items-start">
          <code className="flex-1 max-h-24 overflow-y-auto text-[10px] bg-white/5 border border-white/10 rounded-lg p-2 font-mono text-white/80 break-all leading-relaxed">
            {snippet}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-[var(--mirador-primary,#5e5956)] text-white hover:opacity-90 transition-opacity"
          >
            {copied ? "✓" : "Copiar"}
          </button>
        </div>
      </div>
    );
  }

  const wrapClass =
    variant === "card"
      ? collapsible && !open
        ? "px-5 py-4 md:px-6"
        : "px-5 py-5 md:px-6 md:py-6"
      : "px-4 py-4 md:px-6 border-t border-mirador-border";

  const body = (
    <>
      {!collapsible && (
        <p className="text-xs text-mirador-text-muted mb-2 font-medium uppercase tracking-wider">
          Embed
        </p>
      )}
      <p className="text-xs text-mirador-text-muted mb-2">
        Pega este código en tu sitio. El iframe apunta a{" "}
        <span className="font-mono text-mirador-text">/e/{sceneId}</span> (solo visor).
        Enlace directo al tour:{" "}
        <a href={tourUrl} className="font-mono text-mirador-accent hover:underline break-all">
          /v/{sceneId}
        </a>
      </p>
      <div className="flex gap-2 items-start">
        <code className="flex-1 text-xs bg-[#f3f1ee] border border-mirador-border rounded-lg p-2.5 font-mono text-mirador-text break-all leading-relaxed">
          {snippet}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-3 py-2 text-xs font-medium rounded-lg bg-mirador-accent text-white hover:opacity-90 transition-opacity"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>

      <p className="text-xs text-mirador-text-muted mt-4 mb-2 font-medium uppercase tracking-wider">
        QR · tour completo
      </p>
      <div className="flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt=""
          width={120}
          height={120}
          className="rounded-lg border border-mirador-border bg-mirador-surface p-1"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-mirador-text-muted mb-1">
            Abre en el móvil (página con tour + detalle)
          </p>
          <a
            href={tourUrl}
            className="text-xs text-mirador-accent hover:underline break-all font-mono"
          >
            {tourUrl}
          </a>
        </div>
      </div>
    </>
  );

  if (collapsible) {
    return (
      <div className={wrapClass}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium text-mirador-text transition-colors hover:text-mirador-accent"
        >
          <span>Embed y compartir</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-mirador-text-muted transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
        {open ? <div className="mt-4 border-t border-mirador-border pt-4">{body}</div> : null}
      </div>
    );
  }

  return <div className={wrapClass}>{body}</div>;
}
