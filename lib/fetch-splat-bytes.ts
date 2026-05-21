/**
 * Fetch a splat file with download progress (main thread).
 * Used on mobile Safari where Spark worker fetch + ProgressEvent are unreliable.
 */
export async function fetchSplatBytes(
  url: string,
  onRatio: (loaded: number, total: number) => void
): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const total = Number(res.headers.get("content-length")) || 0;
  const body = res.body;

  if (!body || total <= 0) {
    const buf = await res.arrayBuffer();
    onRatio(1, 1);
    return buf;
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    onRatio(loaded, total);
  }

  const out = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer;
}
