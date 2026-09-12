import type { NotificationType } from '@/services/emailService';

interface TemplateData {
  recipientName: string;
  siteUrl: string;
  [key: string]: string | number | undefined;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5f1;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f1;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#2b2b2b;padding:28px 40px;text-align:center;">
          <h1 style="margin:0;color:#e8b04a;font-size:22px;letter-spacing:0.05em;">ATELIER</h1>
          <p style="margin:4px 0 0;color:#a0a0a0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Rynek zleceń na obrazy</p>
        </td></tr>
        <tr><td style="padding:40px;color:#2b2b2b;font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr><td style="background:#faf8f4;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">Otrzymujesz tę wiadomość jako użytkownik platformy Atelier.</p>
          <p style="margin:8px 0 0;color:#ccc;font-size:11px;">© Atelier - Wszystkie prawa zastrzeżone</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:#e8b04a;color:#2b2b2b;font-weight:600;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.02em;">${label}</a>`;
}

function infoBox(text: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#faf6ec;border-left:3px solid #e8b04a;border-radius:6px;"><tr><td style="padding:16px 20px;color:#6b5b1e;font-size:13px;">${text}</td></tr></table>`;
}

const templates: Record<NotificationType, (d: TemplateData) => EmailTemplate> = {
  user_registered: (d) => ({
    subject: 'Witaj na platformie Atelier!',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Witaj, ${d.recipientName}!</h2>
      <p>Dziękujemy za rejestrację na platformie <strong>Atelier</strong> - miejscu, gdzie zlecający spotykają artystów malarzów.</p>
      <p>Możesz teraz przeglądać zlecenia, składać oferty i zarządzać swoimi projektami.</p>
      ${infoBox('Ważne: Zweryfikuj swój adres e-mail, aby korzystać ze wszystkich funkcji platformy.')}
      ${ctaButton('Przejdź do panelu', `${d.siteUrl}/dashboard`)}
    `),
  }),

  artist_profile_submitted: (d) => ({
    subject: 'Twój profil artysty został wysłany do akceptacji',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Twój profil artysty został przesłany do weryfikacji przez administratora.</p>
      <p>Po zatwierdzeniu Twój profil będzie publicznie widoczny, a Ty będziesz mógł składać oferty na zlecenia.</p>
      ${infoBox('Proces weryfikacji zazwyczaj trwa do 48 godzin.')}
      ${ctaButton('Zobacz swój profil', `${d.siteUrl}/dashboard/artist/profil`)}
    `),
  }),

  artist_approved: (d) => ({
    subject: 'Twój profil artysty został zaakceptowany!',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Gratulacje, ${d.recipientName}!</h2>
      <p>Twój profil artysty został <strong>zaakceptowany</strong> przez administratora.</p>
      <p>Od teraz możesz:</p>
      <ul style="padding-left:20px;color:#555;">
        <li>Składać oferty na zlecenia zlecających</li>
        <li>Zarządzać swoim portfolio</li>
        <li>Otrzymywać zlecenia od klientów</li>
      </ul>
      ${ctaButton('Przeglądaj zlecenia', `${d.siteUrl}/zlecenia`)}
    `),
  }),

  commission_created: (d) => ({
    subject: 'Twoje zlecenie zostało dodane',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Twoje zlecenie <strong>${d.title ?? ''}</strong> zostało dodane do platformy.</p>
      <p>Status: <strong>Oczekuje na weryfikację</strong>. Po zatwierdzeniu przez administratora zlecenie będzie publicznie widoczne i artyści będą mogli składać oferty.</p>
      ${ctaButton('Zobacz zlecenie', `${d.siteUrl}/dashboard/client/zlecenia`)}
    `),
  }),

  commission_approved: (d) => ({
    subject: 'Twoje zlecenie zostało opublikowane',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Twoje zlecenie <strong>${d.title ?? ''}</strong> zostało zatwierdzone i jest teraz <strong>publicznie widoczne</strong>.</p>
      <p>Artyści mogą od teraz składać oferty. Będziesz otrzymywać powiadomienia o każdej nowej ofercie.</p>
      ${ctaButton('Zobacz oferty', `${d.siteUrl}/dashboard/client/oferty`)}
    `),
  }),

  new_comment: (d) => ({
    subject: 'Nowy komentarz pod Twoim zleceniem',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p><strong>${d.actorName ?? 'Użytkownik'}</strong> dodał komentarz pod zleceniem <strong>${d.title ?? ''}</strong>.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#f7f5f1;border-radius:8px;"><tr><td style="padding:16px 20px;color:#555;font-style:italic;">"${d.commentBody ?? ''}"</td></tr></table>
      ${ctaButton('Zobacz komentarz', `${d.siteUrl}/zlecenia/${d.commissionId ?? ''}`)}
    `),
  }),

  new_offer: (d) => ({
    subject: 'Nowa oferta na Twoje zlecenie',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Otrzymałeś nową ofertę od artysty <strong>${d.artistName ?? ''}</strong> na zlecenie <strong>${d.title ?? ''}</strong>.</p>
      ${infoBox(`Kwota: <strong>${d.amount ?? ''} PLN</strong> · Termin realizacji: <strong>${d.estimatedDays ?? ''} dni</strong>`)}
      ${ctaButton('Zobacz ofertę', `${d.siteUrl}/dashboard/client/oferty`)}
    `),
  }),

  offer_accepted: (d) => ({
    subject: 'Twoja oferta została zaakceptowana!',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Gratulacje, ${d.recipientName}!</h2>
      <p>Twoja oferta na zlecenie <strong>${d.title ?? ''}</strong> została <strong>zaakceptowana</strong> przez zlecającego.</p>
      <p>Projekt został utworzony. Klient otrzymał prośbę o opłacenie zaliczki.</p>
      ${ctaButton('Zobacz projekt', `${d.siteUrl}/dashboard/artist/projekty`)}
    `),
  }),

  offer_rejected: (d) => ({
    subject: 'Twoja oferta została odrzucona',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Niestety, Twoja oferta na zlecenie <strong>${d.title ?? ''}</strong> została odrzucona przez zlecającego.</p>
      <p>Nie zniechęcaj się - na platformie jest wiele innych zleceń czekających na Twoją ofertę.</p>
      ${ctaButton('Przeglądaj zlecenia', `${d.siteUrl}/zlecenia`)}
    `),
  }),

  project_created: (d) => ({
    subject: 'Nowy projekt utworzony',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Projekt dla zlecenia <strong>${d.title ?? ''}</strong> został utworzony po zaakceptowaniu oferty.</p>
      <p>Wartość projektu: <strong>${d.totalPrice ?? ''} PLN</strong> (zaliczka ${d.depositPercent ?? 30}%: ${d.depositAmount ?? ''} PLN).</p>
      ${ctaButton('Zobacz projekt', `${d.siteUrl}/dashboard/projekty`)}
    `),
  }),

  deposit_pending: (d) => ({
    subject: 'Oczekiwanie na opłacenie zaliczki',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Projekt <strong>${d.title ?? ''}</strong> czeka na opłacenie zaliczki w wysokości <strong>${d.depositAmount ?? ''} PLN</strong>.</p>
      <p>Po opłaceniu zaliczki artysta rozpocznie pracę nad obrazem.</p>
      ${ctaButton('Opłać zaliczkę', `${d.siteUrl}/dashboard/client/projekty`)}
    `),
  }),

  deposit_paid: (d) => ({
    subject: 'Zaliczka opłacona - realizacja rozpoczęta',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Zaliczka w wysokości <strong>${d.depositAmount ?? ''} PLN</strong> dla projektu <strong>${d.title ?? ''}</strong> została opłacona.</p>
      <p>Artysta rozpoczyna pracę nad obrazem. Będziesz informowany o postępach.</p>
      ${ctaButton('Zobacz projekt', `${d.siteUrl}/dashboard/projekty`)}
    `),
  }),

  preview_uploaded: (d) => ({
    subject: 'Artysta dodał podgląd pracy',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Artysta <strong>${d.artistName ?? ''}</strong> dodał podgląd finalnej pracy dla projektu <strong>${d.title ?? ''}</strong>.</p>
      <p>Możesz teraz zaakceptować podgląd lub poprosić o poprawki. Po akceptacji nastąpi płatność końcowa.</p>
      ${ctaButton('Zobacz podgląd', `${d.siteUrl}/dashboard/client/projekty`)}
    `),
  }),

  final_accepted: (d) => ({
    subject: 'Klient zaakceptował finalny etap',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Klient zaakceptował finalny podgląd pracy dla projektu <strong>${d.title ?? ''}</strong>.</p>
      <p>Oczekujemy na opłacenie płatności końcowej w wysokości <strong>${d.finalAmount ?? ''} PLN</strong>.</p>
      ${ctaButton('Zobacz projekt', `${d.siteUrl}/dashboard/artist/projekty`)}
    `),
  }),

  final_payment_pending: (d) => ({
    subject: 'Oczekiwanie na płatność końcową',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Projekt <strong>${d.title ?? ''}</strong> czeka na opłacenie płatności końcowej w wysokości <strong>${d.finalAmount ?? ''} PLN</strong>.</p>
      <p>Po opłaceniu artysta przygotuje pracę do wysyłki.</p>
      ${ctaButton('Opłać pozostałą kwotę', `${d.siteUrl}/dashboard/client/projekty`)}
    `),
  }),

  final_payment_paid: (d) => ({
    subject: 'Płatność końcowa opłacona',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Płatność końcowa w wysokości <strong>${d.finalAmount ?? ''} PLN</strong> dla projektu <strong>${d.title ?? ''}</strong> została opłacona.</p>
      <p>Artysta przygotuje pracę do wysyłki. Projekt jest niemal ukończony!</p>
      ${ctaButton('Zobacz projekt', `${d.siteUrl}/dashboard/projekty`)}
    `),
  }),

  new_message: (d) => ({
    subject: 'Nowa wiadomość w projekcie',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#2b2b2b;">Cześć, ${d.recipientName}</h2>
      <p>Otrzymałeś nową wiadomość od <strong>${d.actorName ?? ''}</strong> w projekcie <strong>${d.title ?? ''}</strong>.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#f7f5f1;border-radius:8px;"><tr><td style="padding:16px 20px;color:#555;">"${d.messageBody ?? ''}"</td></tr></table>
      ${ctaButton('Otwórz czat', `${d.siteUrl}/dashboard/wiadomosci`)}
    `),
  }),
};

export function getEmailTemplate(type: NotificationType, data: TemplateData): EmailTemplate {
  const builder = templates[type];
  if (!builder) {
    throw new Error(`Nieznany typ powiadomienia: ${type}`);
  }
  return builder(data);
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  user_registered: 'Rejestracja użytkownika',
  artist_profile_submitted: 'Artysta wysłał profil do akceptacji',
  artist_approved: 'Admin zaakceptował artystę',
  commission_created: 'Klient dodał zlecenie',
  commission_approved: 'Admin zaakceptował zlecenie',
  new_comment: 'Nowy komentarz pod zleceniem',
  new_offer: 'Nowa oferta',
  offer_accepted: 'Oferta zaakceptowana',
  offer_rejected: 'Oferta odrzucona',
  project_created: 'Powstał projekt',
  deposit_pending: 'Oczekiwanie na zaliczkę',
  deposit_paid: 'Zaliczka opłacona',
  preview_uploaded: 'Artysta dodał podgląd pracy',
  final_accepted: 'Klient zaakceptował finalny etap',
  final_payment_pending: 'Oczekiwanie na płatność końcową',
  final_payment_paid: 'Płatność końcowa opłacona',
  new_message: 'Nowa wiadomość',
};
