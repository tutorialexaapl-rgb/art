import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDemoGuard } from '@/hooks/useDemoGuard';
import { commissionsService } from '@/services/commissionsService';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  mockCommissions, mockOffers, mockProjects, mockComments, mockConversations,
} from '@/lib/mockData';
import { offersService } from '@/services/offersService';
import { messagesService } from '@/services/messagesService';
import type {
  Commission, CommissionOffer, CommissionProject, Conversation,
  CommissionStatus, OfferStatus, CommissionComment, CommissionCommentAttachment, RoomType, IntendedUse,
} from '@/types';

const CLIENT_IDS = ['u-client-1', 'u-client-2', 'u-client-3', 'u-client-4'];

export function useClientData() {
  const { user } = useAuth();
  const demoGuard = useDemoGuard();
  const clientId = user?.id ?? CLIENT_IDS[0];

  const [commissions, setCommissions] = useState<Commission[]>(isSupabaseConfigured ? [] : mockCommissions);
  const [offers, setOffers] = useState<CommissionOffer[]>(isSupabaseConfigured ? [] : mockOffers);
  const [projects, setProjects] = useState<CommissionProject[]>(mockProjects);
  const [comments, setComments] = useState<CommissionComment[]>(mockComments);
  const [conversations, setConversations] = useState<Conversation[]>(isSupabaseConfigured ? [] : mockConversations);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [offersError, setOffersError] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured || !clientId) return;
    let cancelled = false;
    setLoading(true);
    setOffersError(false);
    const loadCommissions = commissionsService
      .getClientCommissions(clientId)
      .then((data) => { if (!cancelled) setCommissions(data as unknown as Commission[]); })
      .catch((err) => { if (!cancelled) console.error('useClientData: failed to load commissions:', err); });
    const loadOffers = offersService
      .getClientOffers(clientId)
      .then((data) => { if (!cancelled) setOffers(data); })
      .catch((err) => {
        if (!cancelled) {
          console.error('useClientData: failed to load offers:', err);
          setOffersError(true);
        }
      });
    const loadConversations = messagesService
      .getConversations(clientId)
      .then((data) => { if (!cancelled) setConversations(data); })
      .catch((err) => { if (!cancelled) console.error('useClientData: failed to load conversations:', err); });
    Promise.all([loadCommissions, loadOffers, loadConversations]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [clientId, refetchKey]);

  const myCommissions = useMemo(
    () => commissions.filter((c) => c.clientId === clientId),
    [commissions, clientId]
  );

  const myOffers = useMemo(
    () => offers.filter((o) => myCommissions.some((c) => c.id === o.commissionId)),
    [offers, myCommissions]
  );

  const myProjects = useMemo(
    () => projects.filter((p) => p.clientId === clientId),
    [projects, clientId]
  );

  const myConversations = useMemo(
    () => conversations.filter((c) => c.participantIds.includes(clientId)),
    [conversations, clientId]
  );

  const getCommission = useCallback(
    (id: string) => commissions.find((c) => c.id === id || c.slug === id),
    [commissions]
  );

  const getOffersForCommission = useCallback(
    (commissionId: string) => offers.filter((o) => o.commissionId === commissionId),
    [offers]
  );

  const getCommentsForCommission = useCallback(
    (commissionId: string) => comments.filter((c) => c.commissionId === commissionId),
    [comments]
  );

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  /** Accept an offer: mark accepted in DB, decline others, set commission to artist_selected, create project + conversation. */
  const acceptOffer = useCallback(
    async (offerId: string): Promise<CommissionProject | null> => {
      if (demoGuard()) return null;
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) return null;
      const commission = commissions.find((c) => c.id === offer.commissionId);
      if (!commission) return null;

      if (isSupabaseConfigured) {
        try {
          await offersService.acceptOffer(offerId);
          await offersService.rejectOthers(offer.commissionId, offerId);
          await commissionsService.updateStatus(offer.commissionId, 'artist_selected');
          const initialBody = 'Dziękuję za zaakceptowanie oferty! Zaczynamy po wpłacie zaliczki.';
          const dbConv = await messagesService.createConversation({
            type: 'project',
            participantIds: [commission.clientId, offer.artistId],
            participantNames: [commission.clientName, offer.artistName],
            participantAvatarUrls: [undefined, offer.artistAvatarUrl],
            projectTitle: commission.title,
            commissionRequestId: commission.id,
            initialMessage: { senderId: offer.artistId, senderName: offer.artistName, senderRole: 'artist', body: initialBody },
          });
          if (dbConv) {
            setConversations((prev) => prev.some((c) => c.id === dbConv.id) ? prev : [dbConv, ...prev]);
          }
        } catch (err) {
          console.error('acceptOffer: DB error:', err);
        }
      }

      const acceptedOffer: CommissionOffer = {
        ...offer, status: 'accepted', respondedAt: new Date().toISOString(),
      };

      setOffers((prev) =>
        prev.map((o) => {
          if (o.id === offerId) return acceptedOffer;
          if (o.commissionId === offer.commissionId && (o.status === 'submitted' || o.status === 'pending' || o.status === 'viewed' || o.status === 'shortlisted')) {
            return { ...o, status: 'rejected' as OfferStatus, respondedAt: new Date().toISOString() };
          }
          return o;
        })
      );

      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commission.id
            ? { ...c, status: 'artist_selected' as CommissionStatus, updatedAt: new Date().toISOString() }
            : c
        )
      );

      const newProject: CommissionProject = {
        id: `p-new-${Date.now()}`,
        commissionId: commission.id,
        commissionTitle: commission.title,
        clientId: commission.clientId,
        clientName: commission.clientName,
        artistId: offer.artistId,
        artistName: offer.artistName,
        artistAvatarUrl: offer.artistAvatarUrl,
        artistSlug: offer.artistSlug,
        status: 'deposit_pending',
        acceptedOfferId: offer.id,
        totalPrice: offer.price,
        depositAmount: Math.round(offer.price * (offer.depositPercent / 100)),
        depositPaid: false,
        finalAmount: Math.round(offer.price * (1 - offer.depositPercent / 100)),
        finalPaid: false,
        startDate: new Date().toISOString().split('T')[0],
        estimatedCompletion: new Date(Date.now() + offer.estimatedDays * 86400000)
          .toISOString().split('T')[0],
        milestones: [
          { id: `m-${Date.now()}-1`, projectId: `p-new-${Date.now()}`, title: 'Szkice kompozycyjne', description: 'Warianty kompozycji do wyboru', sortOrder: 1, status: 'pending', dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] },
          { id: `m-${Date.now()}-2`, projectId: `p-new-${Date.now()}`, title: 'Podmalowanie', description: 'Warstwa bazowa', sortOrder: 2, status: 'pending', dueDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0] },
          { id: `m-${Date.now()}-3`, projectId: `p-new-${Date.now()}`, title: 'Realizacja', description: 'Główna warstwa malarska', sortOrder: 3, status: 'pending', dueDate: new Date(Date.now() + offer.estimatedDays * 86400000 * 0.7).toISOString().split('T')[0] },
          { id: `m-${Date.now()}-4`, projectId: `p-new-${Date.now()}`, title: 'Werniks i przekazanie', description: 'Werniks końcowy, certyfikat, przekazanie', sortOrder: 4, status: 'pending', dueDate: new Date(Date.now() + offer.estimatedDays * 86400000).toISOString().split('T')[0] },
        ],
        payments: [
          { id: `pay-${Date.now()}-1`, projectId: `p-new-${Date.now()}`, type: 'deposit', amount: Math.round(offer.price * (offer.depositPercent / 100)), percentOfTotal: offer.depositPercent, status: 'pending', dueDate: new Date().toISOString().split('T')[0] },
          { id: `pay-${Date.now()}-2`, projectId: `p-new-${Date.now()}`, type: 'final', amount: Math.round(offer.price * (1 - offer.depositPercent / 100)), percentOfTotal: 100 - offer.depositPercent, status: 'pending', dueDate: new Date(Date.now() + offer.estimatedDays * 86400000).toISOString().split('T')[0] },
        ],
        progressImages: [],
        messages: [
          { id: `msg-${Date.now()}`, projectId: `p-new-${Date.now()}`, senderId: offer.artistId, senderName: offer.artistName, senderRole: 'artist', body: `Dziękuję za zaakceptowanie oferty! Zaczynamy po wpłacie zaliczki.`, createdAt: new Date().toISOString() },
        ],
      };
      setProjects((prev) => [...prev, newProject]);

      // Only add a local conversation fallback in non-Supabase mode
      if (!isSupabaseConfigured) {
        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          type: 'project',
          participantIds: [commission.clientId, offer.artistId],
          participantNames: [commission.clientName, offer.artistName],
          participantAvatarUrls: [undefined, offer.artistAvatarUrl],
          projectTitle: commission.title,
          commissionRequestId: commission.id,
          lastMessageBody: `Dziękuję za zaakceptowanie oferty! Zaczynamy po wpłacie zaliczki.`,
          lastMessageAt: new Date().toISOString(),
          unreadCount: 1,
          createdAt: new Date().toISOString(),
        };
        setConversations((prev) => [newConversation, ...prev]);
      }

      return newProject;
    },
    [offers, commissions, projects, conversations, demoGuard]
  );

  const declineOffer = useCallback(
    async (offerId: string) => {
      if (demoGuard()) return;
      if (isSupabaseConfigured) {
        try {
          await offersService.updateStatus(offerId, 'rejected');
        } catch (err) {
          console.error('declineOffer: DB error:', err);
        }
      }
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? { ...o, status: 'rejected' as OfferStatus, respondedAt: new Date().toISOString() }
            : o
        )
      );
    },
    [offers, demoGuard]
  );

  const createCommission = useCallback(
    async (data: {
      title: string;
      publicSummary: string;
      privateDescription: string;
      roomType: string;
      intendedUse: string;
      style: string;
      mood: string;
      widthCm: number;
      heightCm: number;
      orientation: string;
      preferredColors: string[];
      avoidedColors: string[];
      budgetMin: number;
      budgetMax: number;
      deadline: string;
      needsFrame: boolean;
      needsShipping: boolean;
      location: string;
      inspirationImages: string[];
      interiorImages: string[];
      status: CommissionStatus;
    }): Promise<Commission> => {
      if (demoGuard()) throw new Error('Konto demo nie pozwala na tworzenie.');
      const clientName = user?.displayName ?? 'Klient';

      const serviceInput = {
        clientId,
        clientName,
        title: data.title,
        publicSummary: data.publicSummary,
        privateDescription: data.privateDescription,
        roomType: data.roomType,
        intendedUse: data.intendedUse,
        style: data.style,
        mood: data.mood,
        widthCm: data.widthCm,
        heightCm: data.heightCm,
        orientation: data.orientation || 'custom',
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        deadline: data.deadline,
        frameRequired: data.needsFrame,
        deliveryRequired: data.needsShipping,
        tags: [] as string[],
        medium: 'painting',
        preferredColors: data.preferredColors,
        colorsToAvoid: data.avoidedColors,
        inspirationImages: data.inspirationImages,
        interiorImages: data.interiorImages,
        location: data.location,
        status: data.status,
      };

      const saved = await commissionsService.createCommission(serviceInput);
      if (!saved) {
        throw new Error('Nie udało się zapisać zlecenia - serwis zwrócił null.');
      }

      const savedCommission = saved as unknown as Commission;
      setCommissions((prev) => [savedCommission, ...prev]);
      return savedCommission;
    },
    [clientId, user, demoGuard]
  );

  const updateCommission = useCallback(
    async (commissionId: string, data: {
      title: string;
      publicSummary: string;
      privateDescription: string;
      roomType: string;
      intendedUse: string;
      style: string;
      mood: string;
      widthCm: number;
      heightCm: number;
      orientation: string;
      preferredColors: string[];
      avoidedColors: string[];
      budgetMin: number;
      budgetMax: number;
      deadline: string;
      needsFrame: boolean;
      needsShipping: boolean;
      location: string;
      inspirationImages: string[];
      interiorImages: string[];
      status?: CommissionStatus;
    }): Promise<Commission | null> => {
      const serviceInput = {
        title: data.title,
        publicSummary: data.publicSummary,
        privateDescription: data.privateDescription,
        roomType: data.roomType,
        intendedUse: data.intendedUse,
        style: data.style,
        mood: data.mood,
        widthCm: data.widthCm,
        heightCm: data.heightCm,
        orientation: data.orientation || 'custom',
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        deadline: data.deadline,
        frameRequired: data.needsFrame,
        deliveryRequired: data.needsShipping,
        tags: [] as string[],
        medium: 'painting',
        preferredColors: data.preferredColors,
        colorsToAvoid: data.avoidedColors,
        inspirationImages: data.inspirationImages,
        interiorImages: data.interiorImages,
        location: data.location,
        status: data.status,
      };

      if (isSupabaseConfigured) {
        await commissionsService.updateCommission(commissionId, serviceInput);
      }

      const updated: Commission = {
        ...(commissions.find((c) => c.id === commissionId) as Commission),
        ...data,
        orientation: data.orientation || 'custom',
        status: data.status ?? (commissions.find((c) => c.id === commissionId)?.status ?? 'draft'),
        updatedAt: new Date().toISOString(),
      };
      setCommissions((prev) => prev.map((c) => (c.id === commissionId ? updated : c)));
      return updated;
    },
    [commissions, demoGuard]
  );

  const publishCommission = useCallback(
    async (commissionId: string) => {
      if (demoGuard()) return;
      if (isSupabaseConfigured) {
        try {
          await commissionsService.updateStatus(commissionId, 'offers_open');
        } catch (err) {
          console.error('publishCommission: DB error:', err);
          throw err;
        }
      }
      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commissionId
            ? { ...c, status: 'offers_open' as CommissionStatus, updatedAt: new Date().toISOString() }
            : c
        )
      );
    },
    []
  );

  const closeCommission = useCallback(
    async (commissionId: string) => {
      if (demoGuard()) return;
      if (isSupabaseConfigured) {
        try {
          await commissionsService.updateStatus(commissionId, 'closed');
        } catch (err) {
          console.error('closeCommission: DB error:', err);
        }
      }
      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commissionId
            ? { ...c, status: 'closed' as CommissionStatus, updatedAt: new Date().toISOString() }
            : c
        )
      );
    },
    []
  );

  const addComment = useCallback(
    (commissionId: string, body: string, attachments: CommissionCommentAttachment[] = [], commentType: 'question' | 'suggestion' | 'general' = 'general') => {
      if (!user) return;
      if (demoGuard()) return;
      const newComment: CommissionComment = {
        id: `cm-${Date.now()}`,
        commissionId,
        authorId: user.id,
        authorName: user.displayName,
        authorRole: user.role,
        body,
        attachments,
        isPublic: false,
        isHidden: false,
        commentType,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commissionId
            ? { ...c, commentsCount: c.commentsCount + 1 }
            : c
        )
      );
    },
    [user, demoGuard]
  );

  const deleteComment = useCallback(
    (commentId: string) => {
      if (demoGuard()) return;
      setComments((prev) => {
        const target = prev.find((c) => c.id === commentId);
        if (target) {
          setCommissions((prevComs) =>
            prevComs.map((c) =>
              c.id === target.commissionId
                ? { ...c, commentsCount: Math.max(0, c.commentsCount - 1) }
                : c
            )
          );
        }
        return prev.filter((c) => c.id !== commentId);
      });
    },
    [demoGuard]
  );

  const hideComment = useCallback(
    (commentId: string) => {
      if (demoGuard()) return;
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, isHidden: true } : c))
      );
    },
    []
  );

  const reportComment = useCallback(
    (_commentId: string, _reason: string) => {
      // In the future: insert into moderation_events table
    },
    []
  );

  const refetch = useCallback(() => setRefetchKey((k) => k + 1), []);

  return {
    clientId,
    commissions: myCommissions,
    offers: myOffers,
    projects: myProjects,
    conversations: myConversations,
    loading,
    offersError,
    refetch,
    allCommissions: commissions,
    allOffers: offers,
    allProjects: projects,
    allComments: comments,
    allConversations: conversations,
    getCommission,
    getOffersForCommission,
    getCommentsForCommission,
    getProject,
    acceptOffer,
    declineOffer,
    closeCommission,
    publishCommission,
    addComment,
    deleteComment,
    hideComment,
    reportComment,
    createCommission,
    updateCommission,
  };
}
