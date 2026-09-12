export type UserRole = 'guest' | 'client' | 'artist' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'suspended';

export type CommissionStatus =
  | 'draft' | 'pending_review' | 'published' | 'offers_open' | 'artist_selected'
  | 'in_progress' | 'completed' | 'cancelled' | 'closed'
  | 'hidden' | 'rejected';

export type OfferStatus = 'pending' | 'submitted' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';

export type ProjectStatus =
  | 'artist_selected' | 'deposit_pending' | 'deposit_paid'
  | 'concept_stage' | 'concept_accepted' | 'painting_in_progress'
  | 'preview_uploaded' | 'revision_requested' | 'final_accepted'
  | 'final_payment_pending' | 'fully_paid' | 'delivery_preparation'
  | 'delivered' | 'completed' | 'cancelled' | 'disputed';

export type MilestoneStatus = 'pending' | 'in_progress' | 'done' | 'skipped';

export type ApprovalStatus = 'pending' | 'approved' | 'suspended' | 'rejected';

export type PaymentType = 'deposit' | 'final' | 'additional';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type Orientation = 'landscape' | 'portrait' | 'square';

export type ModerationStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed' | 'rejected';
export type ModerationTarget =
  | 'commission' | 'comment' | 'offer' | 'portfolio_item' | 'profile' | 'message';

export type ConversationType = 'project' | 'direct';

export type RoomType =
  | 'salon' | 'sypialnia' | 'jadalnia' | 'kuchnia'
  | 'biuro' | 'lobby' | 'restauracja' | 'hotel'
  | 'korytarz' | 'balkon' | 'inne';

export type IntendedUse =
  | 'mieszkalne' | 'komercyjne' | 'prezent' | 'kolekcja' | 'investycja';

export interface Profile {
  id: string;
  userId: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  phone?: string;
  clientType?: string;
  company?: string;
  nip?: string;
  preferredStyles?: string[];
  createdAt: string;
}

export interface ArtistPortfolioItem {
  id: string;
  artistId: string;
  title: string;
  imageUrl: string;
  technique: string;
  year: string;
  widthCm: number;
  heightCm: number;
  isPublic: boolean;
  isForSale: boolean;
  price?: number;
  description?: string;
  style?: string;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  slug: string;
  artistName: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio: string;
  location: string;
  styles: string[];
  techniques: string[];
  specializations?: string[];
  priceRangeMin: number;
  priceRangeMax: number;
  averageDeliveryDays: number;
  approvalStatus: ApprovalStatus;
  isVerified: boolean;
  yearsExperience: number;
  website?: string;
  instagram?: string;
  portfolio: ArtistPortfolioItem[];
  stats: {
    completedProjects: number;
    averageRating: number;
    reviewCount: number;
  };
  createdAt: string;
}

export interface CommissionAttachment {
  id: string;
  commissionId: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CommissionRequest {
  id: string;
  slug: string;
  title: string;
  clientId: string;
  clientName: string;
  status: CommissionStatus;

  publicSummary: string;
  privateDescription: string;

  roomType: RoomType;
  intendedUse: IntendedUse;
  style: string;
  mood: string;

  preferredColors: string[];
  colorsToAvoid: string[];

  widthCm: number;
  heightCm: number;
  orientation: Orientation;

  budgetMin: number;
  budgetMax: number;
  deadline: string;
  location?: string;

  frameRequired: boolean;
  deliveryRequired: boolean;

  attachments: CommissionAttachment[];
  inspirationImages: string[];
  interiorImages: string[];

  tags: string[];
  medium: string;

  createdAt: string;
  updatedAt: string;
  views: number;
  commentsCount: number;
  offersCount: number;
}

export interface CommissionCommentAttachment {
  id: string;
  commentId: string;
  url: string;
  filename: string;
  mimeType: string;
}

export interface CommissionComment {
  id: string;
  commissionId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatarUrl?: string;
  body: string;
  attachments: CommissionCommentAttachment[];
  isPublic: boolean;
  isHidden: boolean;
  commentType: 'question' | 'suggestion' | 'general';
  createdAt: string;
}

export interface CommissionOffer {
  id: string;
  commissionId: string;
  artistId: string;
  artistName: string;
  artistAvatarUrl?: string;
  artistSlug?: string;

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
  portfolioRefs: string[];
  attachments?: { id: string; url: string; filename: string; mimeType: string }[];

  status: OfferStatus;
  createdAt: string;
  respondedAt?: string;
  withdrawnAt?: string;
}

export type OfferErrorCode =
  | 'ARTIST_NOT_APPROVED' | 'COMMISSION_CLOSED' | 'OFFER_ALREADY_EXISTS'
  | 'USER_SUSPENDED' | 'VALIDATION_ERROR';

export interface OfferError {
  code: OfferErrorCode;
  message: string;
}

export interface CommissionMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  sortOrder: number;
  status: MilestoneStatus;
  dueDate: string;
  completedAt?: string;
}

export interface CommissionPayment {
  id: string;
  projectId: string;
  type: PaymentType;
  amount: number;
  percentOfTotal: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  stripePaymentIntentId?: string;
  invoiceUrl?: string;
}

export interface CommissionProject {
  id: string;
  commissionId: string;
  commissionTitle: string;

  clientId: string;
  clientName: string;
  artistId: string;
  artistName: string;
  artistAvatarUrl?: string;
  artistSlug?: string;

  status: ProjectStatus;
  acceptedOfferId: string;
  acceptedOffer?: CommissionOffer;
  conversationId?: string;

  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  finalAmount: number;
  finalPaid: boolean;
  stripePaymentIntentId?: string;

  startDate: string;
  estimatedCompletion: string;
  completedAt?: string;

  milestones: CommissionMilestone[];
  payments: CommissionPayment[];
  progressImages: ProgressImage[];
  messages: ProjectMessage[];
}

export interface ProgressImage {
  id: string;
  projectId: string;
  imageUrl: string;
  caption: string;
  stage?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  body: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  body: string;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  participantIds: string[];
  participantNames: string[];
  participantAvatarUrls?: (string | undefined)[];
  projectTitle?: string;
  commissionTitle?: string;
  commissionRequestId?: string;
  commissionProjectId?: string;
  lastMessageBody?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  targetId: string;
  targetType: ModerationTarget;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  description: string;
  status: ModerationStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface ModerationEvent {
  id: string;
  userId?: string;
  eventType: 'moderation_action' | 'contact_attempt' | 'rate_limit' | 'duplicate_message';
  entityType?: string;
  entityId?: string;
  moderatorId?: string;
  moderatorName?: string;
  reportId?: string;
  action: string;
  note?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entity_id: string;
  old_value: string;
  new_value: string;
  reason?: string;
  date: string;
}

export interface PlatformSettings {
  artistApprovalRequired: boolean;
  commissionModerationRequired: boolean;
  depositPercent: number;
  applicationFree: boolean;
  platformMessage: string;
  ownerEmail: string;
}

export interface ContactBypassAttempt {
  id: string;
  userId: string;
  userName: string;
  conversationId: string;
  messageBody: string;
  detectedType: 'email' | 'phone' | 'link';
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  specializations?: string[];
  yearsExperience?: number;
  isVerifiedArtist?: boolean;
  createdAt: string;
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: string;
  version: string;
  acceptedAt: string;
  metadata?: Record<string, unknown>;
}

export type PortfolioItem = ArtistPortfolioItem;
export type Milestone = CommissionMilestone;
export type Comment = CommissionComment;
export type Offer = CommissionOffer;
export type Project = CommissionProject;
export type Commission = CommissionRequest;

export type BlogContentBlockType = 'heading' | 'paragraph' | 'image' | 'list' | 'quote';

export interface BlogContentBlock {
  type: BlogContentBlockType;
  level?: 2 | 3;
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: BlogContentBlock[];
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  noindex: boolean;
  schemaType: string;
  readingTime: number;
  status: BlogPostStatus;
}

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
}
