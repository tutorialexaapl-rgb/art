import { useCallback, useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import type { BlogPost, BlogPostSummary } from '@/types';

export function useBlogPosts(limit = 12) {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    blogService.getPublishedPosts(limit)
      .then((data) => { setPosts(data); setError(null); })
      .catch(() => setError('Nie udało się pobrać artykułów.'))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => { refetch(); }, [refetch]);
  return { posts, loading, error, refetch };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    blogService.getPostBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) { setError('Artykuł nie został znaleziony.'); return; }
        setPost(data);
        setError(null);
      })
      .catch(() => { if (!cancelled) setError('Nie udało się pobrać artykułu.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { post, loading, error };
}

export function useBlogCategory(categorySlug: string) {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    blogService.getPostsByCategory(categorySlug)
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch(() => { if (!cancelled) setPosts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [categorySlug]);

  return { posts, loading };
}

export function useRelatedPosts(currentSlug: string, category: string, tags: string[]) {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSlug) return;
    let cancelled = false;
    setLoading(true);
    blogService.getRelatedPosts(currentSlug, category, tags, 3)
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch(() => { if (!cancelled) setPosts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [currentSlug, category, tags]);

  return { posts, loading };
}
