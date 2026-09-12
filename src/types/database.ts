/**
 * Database row types - mirror the actual Supabase table columns (snake_case).
 * These are the raw shapes returned by the database.
 * Mappers convert them to the application types from src/types/index.ts (camelCase).
 */

import type {
  ArtistProfile, ArtistPortfolioItem, ClientProfile, CommissionAttachment, CommissionComment,
  CommissionCommentAttachment, CommissionOffer, CommissionProject, CommissionRequest,
  Conversation, Message, ModerationReport, ModerationEvent, PaymentStatus, PaymentType, MilestoneStatus,
  Profile, ProjectStatus, ModerationStatus, ProgressImage, ProjectMessage,
  AdminAuditLog, PlatformSettings, ContactBypassAttempt, User,
} from '@/types';

// ── Row types (snake_case, matching DB schema) ──

export interface ProfileRow {
  id: string;
  email: string;
  role: string;
  status: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  email_normalized: string;
  phone_normalized: string | null;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
}

export interface ClientProfileRow {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  client_type: string | null;
  company: string | null;
  nip: string | null;
  preferred_styles: string[] | null;
  created_at: string;
}

export interface ArtistProfileRow {
  id: string;
  user_id: string;
  slug: string;
  artist_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string;
  location: string;
  styles: string[];
  techniques: string[];
  specializations: string[];
  price_range_min: number;
  price_range_max: number;
  average_delivery_days: number;
  approval_status: string;
  is_verified: boolean;
  years_experience: number;
  website: string | null;
  instagram: string | null;
  completed_projects: number;
  average_rating: number;
  review_count: number;
  created_at: string;
}

export interface PortfolioItemRow {
  id: string;
  artist_id: string;
  title: string;
  image_url: string;
  technique: string;
  year: string;
  width_cm: number;
  height_cm: number;
  is_public: boolean;
  is_for_sale: boolean;
  price: number | null;
  created_at: string;
}

export interface CommissionRow {
  id: string;
  slug: string;
  title: string;
  client_id: string;
  client_name: string;
  status: string;
  public_summary: string;
  private_description: string;
  room_type: string;
  intended_use: string;
  style: string;
  mood: string;
  preferred_colors: string[];
  colors_to_avoid: string[];
  width_cm: number;
  height_cm: number;
  orientation: string;
  budget_min: number;
  budget_max: number;
  deadline: string | null;
  location: string | null;
  frame_required: boolean;
  delivery_required: boolean;
  inspiration_images: string[];
  interior_images: string[];
  tags: string[];
  medium: string;
  views: number;
  comments_count: number;
  offers_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommissionAttachmentRow {
  id: string;
  commission_request_id: string;
  url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface CommentRow {
  id: string;
  commission_request_id: string;
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar_url: string | null;
  body: string;
  is_public: boolean;
  is_hidden: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CommentAttachmentRow {
  id: string;
  comment_id: string;
  url: string;
  filename: string;
  mime_type: string;
}

export interface OfferRow {
  id: string;
  commission_request_id: string;
  artist_id: string;
  artist_name: string;
  artist_avatar_url: string | null;
  artist_slug: string | null;
  message: string;
  price: number;
  estimated_days: number;
  includes_materials: boolean;
  includes_shipping: boolean;
  includes_frame: boolean;
  deposit_percent: number;
  portfolio_refs: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  commission_request_id: string;
  commission_title: string;
  client_id: string;
  client_name: string;
  artist_id: string;
  artist_name: string;
  artist_avatar_url: string | null;
  artist_slug: string | null;
  status: string;
  accepted_offer_id: string | null;
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  final_amount: number;
  final_paid: boolean;
  stripe_payment_intent_id: string | null;
  start_date: string | null;
  estimated_completion: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneRow {
  id: string;
  commission_project_id: string;
  title: string;
  description: string;
  sort_order: number;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  commission_project_id: string;
  type: string;
  amount: number;
  percent_of_total: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  stripe_payment_intent_id: string | null;
  invoice_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressImageRow {
  id: string;
  milestone_id: string;
  url: string;
  filename: string;
  mime_type: string;
  caption: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface ProjectMessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  type: string;
  client_id: string | null;
  artist_id: string | null;
  participant_ids: string[] | null;
  participant_names: string[] | null;
  participant_avatar_urls: string[] | null;
  commission_request_id: string | null;
  commission_project_id: string | null;
  project_title: string | null;
  commission_title: string | null;
  last_message_body: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface ModerationReportRow {
  id: string;
  target_id: string | null;
  target_type: string;
  reported_by: string | null;
  reported_by_name: string;
  reason: string;
  description: string;
  status: string;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  created_at: string;
}

export interface ModerationEventRow {
  id: string;
  user_id: string | null;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  moderator_id: string | null;
  moderator_name: string | null;
  report_id: string | null;
  action: string;
  note: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  admin_id: string | null;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string;
  ip_address: string | null;
  created_at: string;
}

// ── Mappers: DB row → App type ──

export function mapProfileRow(r: ProfileRow): Profile {
  return {
    id: r.id,
    userId: r.id,
    role: r.role as Profile['role'],
    displayName: r.display_name,
    avatarUrl: r.avatar_url ?? undefined,
    bio: r.bio ?? undefined,
    location: r.location ?? undefined,
    website: r.website ?? undefined,
    instagram: r.instagram ?? undefined,
    phone: r.phone ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    onboardingCompleted: r.onboarding_completed,
    onboardingCompletedAt: r.onboarding_completed_at ?? undefined,
  };
}

export function mapProfileRowToUser(r: ProfileRow): User {
  return {
    id: r.id,
    email: r.email,
    role: r.role as User['role'],
    status: r.status as User['status'],
    displayName: r.display_name,
    avatarUrl: r.avatar_url ?? undefined,
    bio: r.bio ?? undefined,
    location: r.location ?? undefined,
    website: r.website ?? undefined,
    instagram: r.instagram ?? undefined,
    createdAt: r.created_at,
    onboardingCompleted: r.onboarding_completed,
    onboardingCompletedAt: r.onboarding_completed_at ?? undefined,
  };
}

export function mapClientProfileRow(r: ClientProfileRow): ClientProfile {
  return {
    id: r.id,
    userId: r.user_id,
    displayName: r.display_name,
    avatarUrl: r.avatar_url ?? undefined,
    bio: r.bio ?? undefined,
    location: r.location ?? undefined,
    phone: r.phone ?? undefined,
    clientType: r.client_type ?? undefined,
    company: r.company ?? undefined,
    nip: r.nip ?? undefined,
    preferredStyles: r.preferred_styles ?? undefined,
    createdAt: r.created_at,
  };
}

export function mapArtistProfileRow(r: ArtistProfileRow, portfolio: ArtistPortfolioItem[]): ArtistProfile {
  return {
    id: r.id,
    userId: r.user_id,
    slug: r.slug,
    artistName: r.artist_name,
    avatarUrl: r.avatar_url ?? undefined,
    coverUrl: r.cover_url ?? undefined,
    bio: r.bio,
    location: r.location,
    styles: r.styles ?? [],
    techniques: r.techniques ?? [],
    specializations: r.specializations ?? [],
    priceRangeMin: r.price_range_min,
    priceRangeMax: r.price_range_max,
    averageDeliveryDays: r.average_delivery_days,
    approvalStatus: r.approval_status as ArtistProfile['approvalStatus'],
    isVerified: r.is_verified,
    yearsExperience: r.years_experience,
    website: r.website ?? undefined,
    instagram: r.instagram ?? undefined,
    portfolio,
    stats: {
      completedProjects: r.completed_projects,
      averageRating: Number(r.average_rating),
      reviewCount: r.review_count,
    },
    createdAt: r.created_at,
  };
}

export function mapPortfolioItemRow(r: PortfolioItemRow): ArtistPortfolioItem {
  return {
    id: r.id,
    artistId: r.artist_id,
    title: r.title,
    imageUrl: r.image_url,
    technique: r.technique,
    year: r.year,
    widthCm: r.width_cm,
    heightCm: r.height_cm,
    isPublic: r.is_public,
    isForSale: r.is_for_sale,
    price: r.price ?? undefined,
  };
}

export function mapCommissionRow(r: CommissionRow): CommissionRequest {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    clientId: r.client_id,
    clientName: r.client_name,
    status: r.status as CommissionRequest['status'],
    publicSummary: r.public_summary,
    privateDescription: r.private_description,
    roomType: r.room_type as CommissionRequest['roomType'],
    intendedUse: r.intended_use as CommissionRequest['intendedUse'],
    style: r.style,
    mood: r.mood,
    preferredColors: r.preferred_colors ?? [],
    colorsToAvoid: r.colors_to_avoid ?? [],
    widthCm: r.width_cm,
    heightCm: r.height_cm,
    orientation: r.orientation as CommissionRequest['orientation'],
    budgetMin: r.budget_min,
    budgetMax: r.budget_max,
    deadline: r.deadline ?? '',
    location: r.location ?? undefined,
    frameRequired: r.frame_required,
    deliveryRequired: r.delivery_required,
    attachments: [],
    inspirationImages: r.inspiration_images ?? [],
    interiorImages: r.interior_images ?? [],
    tags: r.tags ?? [],
    medium: r.medium,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    views: r.views,
    commentsCount: r.comments_count,
    offersCount: r.offers_count,
  };
}

export function mapCommissionAttachmentRow(r: CommissionAttachmentRow): CommissionAttachment {
  return {
    id: r.id,
    commissionId: r.commission_request_id,
    url: r.url,
    filename: r.filename,
    mimeType: r.mime_type,
    sizeBytes: r.size_bytes,
    uploadedBy: r.uploaded_by ?? '',
    uploadedAt: r.uploaded_at,
  };
}

export function mapCommentRow(r: CommentRow, attachments: CommissionCommentAttachment[]): CommissionComment {
  return {
    id: r.id,
    commissionId: r.commission_request_id,
    authorId: r.author_id,
    authorName: r.author_name,
    authorRole: r.author_role as CommissionComment['authorRole'],
    authorAvatarUrl: r.author_avatar_url ?? undefined,
    body: r.body,
    attachments,
    isPublic: r.is_public,
    isHidden: r.is_hidden ?? false,
    commentType: 'general',
    createdAt: r.created_at,
  };
}

export function mapCommentAttachmentRow(r: CommentAttachmentRow): CommissionCommentAttachment {
  return {
    id: r.id,
    commentId: r.comment_id,
    url: r.url,
    filename: r.filename,
    mimeType: r.mime_type,
  };
}

export function mapOfferRow(r: OfferRow): CommissionOffer {
  return {
    id: r.id,
    commissionId: r.commission_request_id,
    artistId: r.artist_id,
    artistName: r.artist_name,
    artistAvatarUrl: r.artist_avatar_url ?? undefined,
    artistSlug: r.artist_slug ?? undefined,
    message: r.message,
    price: r.price,
    estimatedDays: r.estimated_days,
    includesMaterials: r.includes_materials,
    includesShipping: r.includes_shipping,
    includesFrame: r.includes_frame,
    depositPercent: r.deposit_percent,
    portfolioRefs: r.portfolio_refs ?? [],
    status: r.status as CommissionOffer['status'],
    createdAt: r.created_at,
    respondedAt: undefined,
    withdrawnAt: undefined,
  };
}

export function mapProjectRow(
  r: ProjectRow,
  milestones: CommissionProject['milestones'],
  payments: CommissionProject['payments'],
  progressImages: ProgressImage[],
  messages: ProjectMessage[],
): CommissionProject {
  return {
    id: r.id,
    commissionId: r.commission_request_id,
    commissionTitle: r.commission_title,
    clientId: r.client_id,
    clientName: r.client_name,
    artistId: r.artist_id,
    artistName: r.artist_name,
    artistAvatarUrl: r.artist_avatar_url ?? undefined,
    artistSlug: r.artist_slug ?? undefined,
    status: r.status as ProjectStatus,
    acceptedOfferId: r.accepted_offer_id ?? '',
    conversationId: undefined,
    totalPrice: r.total_price,
    depositAmount: r.deposit_amount,
    depositPaid: r.deposit_paid,
    finalAmount: r.final_amount,
    finalPaid: r.final_paid,
    stripePaymentIntentId: r.stripe_payment_intent_id ?? undefined,
    startDate: r.start_date ?? '',
    estimatedCompletion: r.estimated_completion ?? '',
    completedAt: r.completed_at ?? undefined,
    milestones,
    payments,
    progressImages,
    messages,
  };
}

export function mapMilestoneRow(r: MilestoneRow): CommissionProject['milestones'][number] {
  return {
    id: r.id,
    projectId: r.commission_project_id,
    title: r.title,
    description: r.description,
    sortOrder: r.sort_order,
    status: r.status as MilestoneStatus,
    dueDate: r.due_date ?? '',
    completedAt: r.completed_at ?? undefined,
  };
}

export function mapPaymentRow(r: PaymentRow): CommissionProject['payments'][number] {
  return {
    id: r.id,
    projectId: r.commission_project_id,
    type: r.type as PaymentType,
    amount: r.amount,
    percentOfTotal: r.percent_of_total,
    status: r.status as PaymentStatus,
    dueDate: r.due_date ?? '',
    paidAt: r.paid_at ?? undefined,
    stripePaymentIntentId: r.stripe_payment_intent_id ?? undefined,
    invoiceUrl: r.invoice_url ?? undefined,
  };
}

export function mapProgressImageRow(r: ProgressImageRow): ProgressImage {
  return {
    id: r.id,
    projectId: '',
    imageUrl: r.url,
    caption: r.caption ?? '',
    uploadedAt: r.uploaded_at,
    uploadedBy: r.uploaded_by ?? '',
  };
}

export function mapProjectMessageRow(r: ProjectMessageRow): ProjectMessage {
  return {
    id: r.id,
    projectId: '',
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderRole: r.sender_role as ProjectMessage['senderRole'],
    body: r.body,
    createdAt: r.created_at,
  };
}

export function mapConversationRow(r: ConversationRow): Conversation {
  const ids = r.participant_ids ?? [r.client_id, r.artist_id];
  return {
    id: r.id,
    type: r.type as Conversation['type'],
    participantIds: ids.filter(Boolean) as string[],
    participantNames: (r.participant_names ?? []).map((n) => n ?? undefined) as string[],
    participantAvatarUrls: (r.participant_avatar_urls ?? []).map((u) => u ?? undefined) as (string | undefined)[],
    projectTitle: r.project_title ?? undefined,
    commissionTitle: r.commission_title ?? undefined,
    commissionRequestId: r.commission_request_id ?? undefined,
    commissionProjectId: r.commission_project_id ?? undefined,
    lastMessageBody: r.last_message_body ?? undefined,
    lastMessageAt: r.last_message_at ?? undefined,
    unreadCount: r.unread_count,
    createdAt: r.created_at,
  };
}

export function mapMessageRow(r: MessageRow): Message {
  return {
    id: r.id,
    conversationId: r.conversation_id,
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderRole: r.sender_role as Message['senderRole'],
    body: r.body,
    readAt: r.read_at ?? undefined,
    createdAt: r.created_at,
  };
}

export function mapModerationReportRow(r: ModerationReportRow): ModerationReport {
  return {
    id: r.id,
    targetId: r.target_id ?? '',
    targetType: r.target_type as ModerationReport['targetType'],
    reportedBy: r.reported_by ?? '',
    reportedByName: r.reported_by_name,
    reason: r.reason,
    description: r.description,
    status: r.status as ModerationStatus,
    resolvedBy: r.resolved_by ?? undefined,
    resolvedAt: r.resolved_at ?? undefined,
    resolutionNote: r.resolution_note ?? undefined,
    createdAt: r.created_at,
  };
}

export function mapModerationEventRow(r: ModerationEventRow): ModerationEvent {
  return {
    id: r.id,
    userId: r.user_id ?? undefined,
    eventType: r.event_type as ModerationEvent['eventType'],
    entityType: r.entity_type ?? undefined,
    entityId: r.entity_id ?? undefined,
    moderatorId: r.moderator_id ?? undefined,
    moderatorName: r.moderator_name ?? undefined,
    reportId: r.report_id ?? undefined,
    action: r.action,
    note: r.note ?? undefined,
    metadata: r.metadata ?? undefined,
    createdAt: r.created_at,
  };
}

export function mapAuditLogRow(r: AuditLogRow): AdminAuditLog {
  return {
    id: r.id,
    adminId: r.admin_id ?? '',
    adminName: r.admin_name,
    action: r.action,
    entityType: r.target_type,
    entity_id: r.target_id ?? '',
    old_value: '',
    new_value: r.details,
    date: r.created_at,
  };
}

// ── App → DB input mappers (for inserts/updates) ──

export function commissionToInsert(r: Omit<CommissionRow, 'id' | 'created_at' | 'updated_at' | 'views' | 'comments_count' | 'offers_count'>) {
  return r;
}

export type PlatformSettingsRow = PlatformSettings;
export type ContactBypassAttemptRow = ContactBypassAttempt;

// Re-export commonly used app types for convenience
export type {
  Profile, User, ClientProfile, ArtistProfile, ArtistPortfolioItem,
  CommissionRequest, CommissionComment, CommissionOffer, CommissionProject,
  Conversation, Message, ModerationReport, ModerationEvent, AdminAuditLog, PlatformSettings, ContactBypassAttempt,
};
