import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDemoGuard } from '@/hooks/useDemoGuard';
import {
  mockArtistProfiles, mockCommissions, mockOffers, mockProjects,
  mockComments, mockConversations,
} from '@/lib/mockData';
import { commissionsService } from '@/services/commissionsService';
import { offersService } from '@/services/offersService';
import { commentsService } from '@/services/commentsService';
import { artistsService } from '@/services/artistsService';
import { messagesService } from '@/services/messagesService';
import { isSupabaseConfigured } from '@/lib/supabase';
import type {
  ArtistProfile, ArtistPortfolioItem, CommissionRequest,
  CommissionOffer, CommissionComment, Conversation, OfferStatus,
} from '@/types';

const ARTIST_ID = 'u-artist-1';

interface OfferSubmitData {
  message: string;
  price: number;
  priceMax?: number;
  estimatedDays: number;
  scopeDescription?: string;
  additionalNotes?: string;
  includesMaterials: boolean;
  includesShipping: boolean;
  includesFrame: boolean;
  depositPercent: number;
}

export function useArtistData() {
  const { user } = useAuth();
  const demoGuard = useDemoGuard();
  const artistId = user?.id ?? ARTIST_ID;

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [commissions, setCommissions] = useState<CommissionRequest[]>(mockCommissions);
  const [offers, setOffers] = useState<CommissionOffer[]>(mockOffers);
  const [comments, setComments] = useState<CommissionComment[]>(mockComments);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [projects] = useState(mockProjects);
  const [loading, setLoading] = useState(true);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    async function loadAll() {
      const results = await Promise.allSettled([
        artistsService.getByUserId(artistId),
        commissionsService.getPublicCommissions(),
        offersService.getByArtist(artistId),
        commentsService.getAll(),
        messagesService.getConversations(artistId),
      ]);
      if (cancelled) return;

      const [profileRes, commissionsRes, offersRes, commentsRes, conversationsRes] = results;

      if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
      if (commissionsRes.status === 'fulfilled') setCommissions(commissionsRes.value);
      if (offersRes.status === 'fulfilled') {
        setOffers(offersRes.value.length > 0 ? offersRes.value : mockOffers.filter((o) => o.artistId === artistId));
      }
      if (commentsRes.status === 'fulfilled') setComments(commentsRes.value);
      if (conversationsRes.status === 'fulfilled') {
        setConversations(conversationsRes.value.length > 0 ? conversationsRes.value : mockConversations.filter((c) => c.participantIds.includes(artistId)));
      }
      setLoading(false);
    }
    loadAll();
    return () => { cancelled = true; };
  }, [artistId, refetchFlag]);

  const isPending = profile?.approvalStatus === 'pending';

  const openCommissions = useMemo(
    () => commissions.filter((c) => c.status === 'published' || c.status === 'offers_open'),
    [commissions]
  );

  const myOffers = useMemo(
    () => offers.filter((o) => o.artistId === artistId),
    [offers, artistId]
  );

  const acceptedOffers = useMemo(
    () => myOffers.filter((o) => o.status === 'accepted'),
    [myOffers]
  );

  const myProjects = useMemo(
    () => projects.filter((p) => p.artistId === artistId),
    [projects, artistId]
  );

  const myConversations = useMemo(
    () => conversations.filter((c) => c.participantIds.includes(artistId)),
    [conversations, artistId]
  );

  const recentComments = useMemo(
    () => comments
      .filter((c) => c.authorId === artistId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [comments, artistId]
  );

  const getCommission = useCallback(
    (id: string) => commissions.find((c) => c.id === id || c.slug === id),
    [commissions]
  );

  const getCommentsForCommission = useCallback(
    (commissionId: string) => comments.filter((c) => c.commissionId === commissionId),
    [comments]
  );

  const getOffersForCommission = useCallback(
    (commissionId: string) => offers.filter((o) => o.commissionId === commissionId),
    [offers]
  );

  const hasOffered = useCallback(
    (commissionId: string) => offers.some((o) => o.commissionId === commissionId && o.artistId === artistId),
    [offers, artistId]
  );

  const updateProfile = useCallback((data: Partial<ArtistProfile>) => {
    if (demoGuard()) return;
    setProfile((prev) => prev ? { ...prev, ...data } : prev);
  }, []);

  const addPortfolioItem = useCallback((item: Omit<ArtistPortfolioItem, 'id' | 'artistId'>) => {
    if (demoGuard()) return;
    if (!profile) return;
    const newItem: ArtistPortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
      artistId,
    };
    setProfile((prev) => prev ? { ...prev, portfolio: [newItem, ...prev.portfolio] } : prev);
  }, [artistId, profile]);

  const updatePortfolioItem = useCallback((id: string, data: Partial<ArtistPortfolioItem>) => {
    if (demoGuard()) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            portfolio: prev.portfolio.map((item) =>
              item.id === id ? { ...item, ...data } : item
            ),
          }
        : prev
    );
  }, []);

  const deletePortfolioItem = useCallback((id: string) => {
    if (demoGuard()) return;
    setProfile((prev) =>
      prev ? { ...prev, portfolio: prev.portfolio.filter((item) => item.id !== id) } : prev
    );
  }, []);

  const featurePortfolioItem = useCallback((id: string) => {
    if (demoGuard()) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            portfolio: prev.portfolio.map((item) =>
              item.id === id ? { ...item, isPublic: !item.isPublic } : item
            ),
          }
        : prev
    );
  }, []);

  const submitOffer = useCallback(async (commissionId: string, data: OfferSubmitData): Promise<void> => {
    if (demoGuard()) return;
    if (!profile) return;
    if (!isSupabaseConfigured) {
      const newOffer: CommissionOffer = {
        id: `o-new-${Date.now()}`,
        commissionId,
        artistId,
        artistName: profile.artistName,
        artistAvatarUrl: profile.avatarUrl,
        artistSlug: profile.slug,
        message: data.message,
        price: data.price,
        priceMax: data.priceMax,
        estimatedDays: data.estimatedDays,
        scopeDescription: data.scopeDescription,
        additionalNotes: data.additionalNotes,
        includesMaterials: data.includesMaterials,
        includesShipping: data.includesShipping,
        includesFrame: data.includesFrame,
        depositPercent: data.depositPercent,
        portfolioRefs: profile.portfolio.slice(0, 3).map((p) => p.id),
        status: 'submitted',
        createdAt: new Date().toISOString(),
      };
      setOffers((prev) => [...prev, newOffer]);
      return;
    }
    await offersService.createOffer({
      commissionId,
      artistId,
      artistName: profile.artistName,
      artistAvatarUrl: profile.avatarUrl,
      artistSlug: profile.slug,
      message: data.message,
      price: data.price,
      estimatedDays: data.estimatedDays,
      includesMaterials: data.includesMaterials,
      includesShipping: data.includesShipping,
      includesFrame: data.includesFrame,
      depositPercent: data.depositPercent,
      portfolioRefs: profile.portfolio.slice(0, 3).map((p) => p.id),
    });
    await refetch();
  }, [profile, artistId, refetch]);

  const withdrawOffer = useCallback(
    async (offerId: string): Promise<void> => {
      if (demoGuard()) return;
      if (!isSupabaseConfigured) {
        setOffers((prev) =>
          prev.map((o) =>
            o.id === offerId && o.status !== 'accepted'
              ? { ...o, status: 'withdrawn' as OfferStatus, withdrawnAt: new Date().toISOString() }
              : o
          )
        );
        return;
      }
      await offersService.updateStatus(offerId, 'withdrawn');
      await refetch();
    },
    [refetch]
  );

  const addComment = useCallback((commissionId: string, body: string, attachments?: { url: string; filename: string; mimeType: string }[], commentType: 'question' | 'suggestion' | 'general' = 'general') => {
    if (!user || !profile) return;
    if (demoGuard()) return;
    const commentId = `cm-${Date.now()}`;
    const newComment: CommissionComment = {
      id: commentId,
      commissionId,
      authorId: user.id,
      authorName: profile.artistName,
      authorRole: 'artist',
      authorAvatarUrl: profile.avatarUrl,
      body,
      attachments: attachments?.map((a, i) => ({ id: `cma-${Date.now()}-${i}`, commentId, ...a })) ?? [],
      isPublic: false,
      isHidden: false,
      commentType,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    if (isSupabaseConfigured) {
      commentsService.addCommissionComment({
        commissionId,
        authorId: user.id,
        authorName: profile.artistName,
        authorRole: 'artist',
        authorAvatarUrl: profile.avatarUrl,
        body,
        isPublic: true,
      }).then(() => refetch()).catch(() => {});
    }
  }, [user, profile, refetch]);

  const deleteComment = useCallback((commentId: string) => {
    if (demoGuard()) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    if (isSupabaseConfigured) {
      commentsService.delete(commentId).catch(() => {});
    }
  }, []);

  const hideComment = useCallback((commentId: string) => {
    if (demoGuard()) return;
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, isHidden: true } : c)));
    if (isSupabaseConfigured) {
      commentsService.setHidden(commentId, true).catch(() => {});
    }
  }, []);

  const reportComment = useCallback((_commentId: string, _reason: string) => {
  }, []);

  return {
    profile: profile ?? mockArtistProfiles[0],
    isPending,
    openCommissions,
    myOffers,
    acceptedOffers,
    myProjects,
    myConversations,
    recentComments,
    getCommission,
    getCommentsForCommission,
    getOffersForCommission,
    hasOffered,
    updateProfile,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    featurePortfolioItem,
    submitOffer,
    withdrawOffer,
    addComment,
    deleteComment,
    hideComment,
    reportComment,
    loading,
    refetch,
  };
}
