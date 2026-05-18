"use client";

import { useState } from "react";
import { trackEmbedCopied } from "@/lib/analytics";

interface EmbedSnippetProps {
  sceneId: string;
}

export function EmbedSnippet({ sceneId }: EmbedSnippetProps) {
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://mirador.umbraltech.co";

  const snippet = `<iframe src="${origin}/e/${sceneId}" width="100%" height="500" style="border:none;border-radius:12px;" allowfullscreen loading="lazy"></iframe>`;

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
    </div>
  );
}
