import { Link } from 'react-router-dom';
import type { BlogContentBlock } from '@/types';
import { injectInternalLinks } from '@/lib/internalLinks';
import { SeoImage } from '@/components/ui/SeoImage';

function renderInlineText(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: { type: 'text' | 'link'; content: string; href?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'link', content: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.map((part, i) => {
    if (part.type === 'link' && part.href) {
      const isInternal = part.href.startsWith('/');
      if (isInternal) {
        return (
          <Link key={i} to={part.href} className="text-gold-600 hover:text-gold-700 underline underline-offset-2 transition-colors">
            {part.content}
          </Link>
        );
      }
      return (
        <a key={i} href={part.href} className="text-gold-600 hover:text-gold-700 underline underline-offset-2 transition-colors" rel="noopener noreferrer">
          {part.content}
        </a>
      );
    }
    return <span key={i}>{part.content}</span>;
  });
}

interface BlogContentRendererProps {
  blocks: BlogContentBlock[];
  excerpt?: string;
}

export function BlogContentRenderer({ blocks, excerpt }: BlogContentRendererProps) {
  const processedBlocks = injectInternalLinks(blocks);

  return (
    <div className="space-y-6">
      {excerpt && (
        <p className="text-lg text-graphite-500 text-pretty leading-relaxed font-display">
          {excerpt}
        </p>
      )}
      {processedBlocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 3) {
              return (
                <h3 key={i} className="font-display text-xl text-graphite-600 mt-8 text-balance">
                  {block.text}
                </h3>
              );
            }
            return (
              <h2 key={i} className="font-display text-2xl text-graphite-600 mt-10 text-balance">
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={i} className="text-graphite-500 leading-relaxed text-pretty">
                {block.text && renderInlineText(block.text)}
              </p>
            );
          case 'image':
            return (
              <figure key={i} className="my-8">
                <SeoImage
                  src={block.src ?? ''}
                  alt={block.alt ?? ''}
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-graphite-300">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case 'list':
            return (
              <ul key={i} className="space-y-2 text-graphite-500 leading-relaxed">
                {block.items?.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-gold-500 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                    <span>{renderInlineText(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 border-gold-400 pl-6 my-8 italic text-graphite-500 font-display text-lg">
                {block.text}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
