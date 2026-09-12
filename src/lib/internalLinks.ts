import type { BlogContentBlock } from '@/types';

interface InternalLink {
  href: string;
  label: string;
  keywords: string[];
}

const INTERNAL_LINKS: InternalLink[] = [
  { href: '/obrazy-na-zamowienie', label: 'obrazy na zamówienie', keywords: ['obrazy na zamówienie', 'obraz na zamówienie', 'na zamówienie'] },
  { href: '/zlec-obraz', label: 'zleć obraz', keywords: ['zleć obraz', 'zlecić obraz', 'zlecić wykonanie obrazu'] },
  { href: '/zamow-obraz', label: 'zamów obraz', keywords: ['zamów obraz', 'zamowić obraz', 'zamówienie obrazu'] },
  { href: '/artysci', label: 'artystów', keywords: ['artystów', 'artyści', 'artysta malarz', 'malarzy'] },
  { href: '/zlecenia', label: 'zlecenia', keywords: ['zlecenia', 'zlecenie', 'otwarte zlecenia'] },
  { href: '/zlecenia-dla-artystow', label: 'zlecenia dla artystów', keywords: ['zlecenia dla artystów', 'zlecenia malarskie'] },
  { href: '/obrazy-do-salonu', label: 'obrazy do salonu', keywords: ['obraz do salonu', 'obrazy do salonu', 'obraz nad kanapę'] },
  { href: '/obrazy-do-sypialni', label: 'obrazy do sypialni', keywords: ['obraz do sypialni', 'obrazy do sypialni', 'obraz nad łóżko'] },
  { href: '/obrazy-do-biura', label: 'obrazy do biura', keywords: ['obraz do biura', 'obrazy do biura', 'sztuka do biura'] },
  { href: '/jak-to-dziala', label: 'jak to działa', keywords: ['jak to działa', 'jak działa zlecanie'] },
  { href: '/cennik', label: 'cennik', keywords: ['cennik', 'ceny obrazów', 'ile kosztuje obraz'] },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findLinkInText(text: string): InternalLink | null {
  const lower = text.toLowerCase();
  for (const link of INTERNAL_LINKS) {
    for (const kw of link.keywords) {
      const pattern = `\\b${escapeRegex(kw)}\\b`;
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lower)) {
        return link;
      }
    }
  }
  return null;
}

function applyLinkToText(text: string, link: InternalLink): string {
  let result = text;
  for (const kw of link.keywords) {
    const pattern = new RegExp(`\\b(${escapeRegex(kw)})\\b`, 'i');
    const match = result.match(pattern);
    if (match) {
      const matchedText = match[1];
      result = result.replace(match[0], `[${matchedText}](${link.href})`);
      return result;
    }
  }
  return result;
}

export function injectInternalLinks(blocks: BlogContentBlock[], maxLinks = 3): BlogContentBlock[] {
  let linksAdded = 0;
  const usedHrefs = new Set<string>();
  const paragraphIndices: number[] = [];

  blocks.forEach((block, i) => {
    if (block.type === 'paragraph' && block.text) {
      paragraphIndices.push(i);
    }
  });

  if (paragraphIndices.length === 0) return blocks;

  const spacing = Math.max(1, Math.floor(paragraphIndices.length / (maxLinks + 1)));

  return blocks.map((block, i) => {
    if (block.type !== 'paragraph' || !block.text || linksAdded >= maxLinks) {
      return block;
    }

    const paragraphOrder = paragraphIndices.indexOf(i);
    if (paragraphOrder < 0 || paragraphOrder % spacing !== 0) {
      return block;
    }

    const link = findLinkInText(block.text);
    if (!link || usedHrefs.has(link.href)) {
      return block;
    }

    const newText = applyLinkToText(block.text, link);
    if (newText !== block.text) {
      linksAdded++;
      usedHrefs.add(link.href);
      return { ...block, text: newText };
    }

    return block;
  });
}

export const BLOG_INTERNAL_LINKS = INTERNAL_LINKS;
