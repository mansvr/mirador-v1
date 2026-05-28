"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

interface HeroHlsProps {
  hlsUrl: string | null;
  posterUrl: string;
  title: string;
}

export function HeroHls({ hlsUrl, posterUrl, title }: HeroHlsProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "poster">(
    hlsUrl ? "loading" : "poster",
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    setStatus("loading");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadeddata", () => setStatus("ready"), {
        once: true,
      });
      return;
    }

    if (!Hls.isSupported()) {
      // Defer to avoid linting warnings about state updates during effect execution.
      void Promise.resolve().then(() => setStatus("poster"));
      return;
    }

    const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setStatus("ready");
      void video.play().catch(() => undefined);
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) setStatus("poster");
    });

    return () => {
      hls.destroy();
    };
  }, [hlsUrl]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-viewer">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        aria-label={title}
      />
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-viewer/60">
          <span className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
            Cargando recorrido…
          </span>
        </div>
      )}
      {status === "poster" && !hlsUrl && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 max-w-xs -translate-x-1/2 rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-center text-sm text-white/70 backdrop-blur-sm">
          Añade <code className="text-white/90">NEXT_PUBLIC_HLS_URL</code> cuando
          el video esté en Stream
        </div>
      )}
    </div>
  );
}
