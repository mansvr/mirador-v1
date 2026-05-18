"use client";

import { useState } from "react";
import { trackEmbedCopied } from "@/lib/analytics";

interface EmbedSnippetProps {
  sceneId: string;
  /** Must come from the server (e.g. getSiteUrl()) so SSR matches hydration. */
  siteUrl: string;
}

export function EmbedSnippet({ sceneId, siteUrl }: EmbedSnippetProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="px-4 py-4 md:px-6 border-t border-gray-100">
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
        Embed
      </p>
      <div className="flex gap-2 items-start">
        <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 font-mono text-gray-700 break-all leading-relaxed">
          {snippet}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-2 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 mb-2 font-medium uppercase tracking-wider">
        QR · tour completo
      </p>
      <div className="flex flex-wrap items-center gap-4">
        {/* v0: third-party QR; swap for self-hosted / canvas in v1 if policy requires */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt=""
          width={120}
          height={120}
          className="rounded-lg border border-gray-200 bg-white p-1"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 mb-1">Abre en el móvil (página con tour + detalle)</p>
          <a
            href={tourUrl}
            className="text-xs text-blue-600 hover:underline break-all font-mono"
          >
            {tourUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
