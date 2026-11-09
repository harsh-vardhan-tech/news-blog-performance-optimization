import DOMPurify from 'dompurify';

/**
 * Sanitizes user-provided string inputs to neutralize XSS attacks
 * before persisting or storing in React state.
 * Strips all dangerous HTML/script tags while preserving clean textual content.
 */
export function sanitizeInput(value: string): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();

  // Strip obvious script tags and dangerous event handlers immediately
  const preCleaned = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+on\w+\s*=[^>]*>/gi, '')
    .replace(/<[^>]*>?/gm, '');

  try {
    let purify = DOMPurify;
    if (typeof DOMPurify === 'function' && typeof window !== 'undefined') {
      purify = DOMPurify(window as unknown as Window & typeof globalThis);
    }

    if (purify && typeof purify.sanitize === 'function') {
      return purify.sanitize(preCleaned, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      });
    }
  } catch {
    // Graceful fallback to regex-cleaned text if DOMPurify is unable to mount
  }

  return preCleaned;
}

/**
 * Validates whether a provided URL or slug conforms to acceptable web formats.
 */
export function isValidUrlOrSlug(urlOrSlug: string): boolean {
  if (!urlOrSlug || typeof urlOrSlug !== 'string') return false;
  const trimmed = urlOrSlug.trim();
  // Allow valid relative slugs (e.g., /news/breaking-article) or full HTTP(S) URLs
  const relativeSlugPattern = /^\/[a-zA-Z0-9-_./]+$/;
  const fullUrlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
  return relativeSlugPattern.test(trimmed) || fullUrlPattern.test(trimmed);
}
