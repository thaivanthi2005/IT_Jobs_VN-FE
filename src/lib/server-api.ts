import { API_URL } from "@/config/variable";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.devjobs.click";

/**
 * Fetch helper for Server Components.
 *
 * Tries the primary API_URL (INTERNAL_API_URL when in Docker) first for low-latency
 * host-to-container communication. If that fails (e.g., bridge DNS or firewall issue),
 * it seamlessly falls back to the public HTTPS domain (https://api.devjobs.click).
 */
export async function fetchServerApi(path: string, options?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const timeoutMs = 8000;

  // 1. Primary attempt: internal Docker network (or configured API_URL)
  try {
    const res = await fetch(`${API_URL}${cleanPath}`, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.ok) return res;
  } catch (err) {
    console.warn(`[fetchServerApi] Primary fetch (${API_URL}${cleanPath}) failed:`, err);
  }

  // 2. Fallback attempt: public HTTPS domain
  if (API_URL !== PUBLIC_API_URL) {
    try {
      const fallbackRes = await fetch(`${PUBLIC_API_URL}${cleanPath}`, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (fallbackRes.ok) return fallbackRes;
    } catch (fallbackErr) {
      console.error(
        `[fetchServerApi] Fallback fetch (${PUBLIC_API_URL}${cleanPath}) failed:`,
        fallbackErr
      );
    }
  }

  throw new Error(`[fetchServerApi] Failed to fetch ${cleanPath}`);
}

