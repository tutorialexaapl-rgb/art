export interface ContactDetectionResult {
  hasEmail: boolean;
  hasPhone: boolean;
  hasLink: boolean;
  matches: string[];
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:(?:\+48|0048|48)\s?)?(?:\d[\s-]?){8,9}\d/g;
const LINK_RE = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;

export function detectContactAttempts(text: string): ContactDetectionResult {
  const matches: string[] = [];
  const emails = text.match(EMAIL_RE) ?? [];
  const phones = text.match(PHONE_RE) ?? [];
  const links = text.match(LINK_RE) ?? [];
  matches.push(...emails, ...phones, ...links);
  return {
    hasEmail: emails.length > 0,
    hasPhone: phones.length > 0,
    hasLink: links.length > 0,
    matches,
  };
}
