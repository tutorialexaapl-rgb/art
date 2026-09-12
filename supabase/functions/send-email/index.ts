import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const PLATFORM_EMAIL_FROM = Deno.env.get("PLATFORM_EMAIL_FROM") ?? "Atelier <noreply@atelier.local>";
const PLATFORM_OWNER_EMAIL = Deno.env.get("PLATFORM_OWNER_EMAIL") ?? "";
const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:5173";

interface TemplateData {
  recipientName: string;
  [key: string]: string | number | undefined;
}

interface EmailPayload {
  to: string;
  type: string;
  data: TemplateData;
}

const SUBJECT_MAP: Record<string, string> = {
  user_registered: "Witaj na platformie Atelier!",
  artist_profile_submitted: "Twój profil artysty został wysłany do akceptacji",
  artist_approved: "Twój profil artysty został zaakceptowany!",
  commission_created: "Twoje zlecenie zostało dodane",
  commission_approved: "Twoje zlecenie zostało opublikowane",
  new_comment: "Nowy komentarz pod Twoim zleceniem",
  new_offer: "Nowa oferta na Twoje zlecenie",
  offer_accepted: "Twoja oferta została zaakceptowana!",
  offer_rejected: "Twoja oferta została odrzucona",
  project_created: "Nowy projekt utworzony",
  deposit_pending: "Oczekiwanie na opłacenie zaliczki",
  deposit_paid: "Zaliczka opłacona — realizacja rozpoczęta",
  preview_uploaded: "Artysta dodał podgląd pracy",
  final_accepted: "Klient zaakceptował finalny etap",
  final_payment_pending: "Oczekiwanie na płatność końcową",
  final_payment_paid: "Płatność końcowa opłacona",
  new_message: "Nowa wiadomość w projekcie",
};

function buildEmailHtml(type: string, data: TemplateData): string {
  const name = data.recipientName ?? "Użytkowniku";
  const title = (data.title as string) ?? "—";
  const siteUrl = (data.siteUrl as string) ?? SITE_URL;
  const subject = SUBJECT_MAP[type] ?? "Powiadomienie z platformy Atelier";

  return `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f5f1;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f1;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#2b2b2b;padding:28px 40px;text-align:center;">
          <h1 style="margin:0;color:#e8b04a;font-size:22px;letter-spacing:0.05em;">ATELIER</h1>
          <p style="margin:4px 0 0;color:#a0a0a0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Rynek zleceń na obrazy</p>
        </td></tr>
        <tr><td style="padding:40px;color:#2b2b2b;font-size:15px;line-height:1.6;">
          <h2 style="margin:0 0 16px;">Cześć, ${name}</h2>
          <p>Typ powiadomienia: <strong>${type}</strong></p>
          <p>${subject}</p>
          <p>Dotyczy: <strong>${title}</strong></p>
          <p style="margin-top:24px;"><a href="${siteUrl}/dashboard" style="display:inline-block;background:#e8b04a;color:#2b2b2b;font-weight:600;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">Przejdź do panelu</a></p>
        </td></tr>
        <tr><td style="background:#faf8f4;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">Otrzymujesz tę wiadomość jako użytkownik platformy Atelier.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.type) {
      return new Response(
        JSON.stringify({ error: "Brak wymaganego parametru: to, type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Resend nie jest skonfigurowany. Ustaw RESEND_API_KEY w Supabase Edge Function secrets.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject = SUBJECT_MAP[payload.type] ?? "Powiadomienie z platformy Atelier";
    const html = buildEmailHtml(payload.type, { ...payload.data, siteUrl: (payload.data.siteUrl as string) ?? SITE_URL });

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: PLATFORM_EMAIL_FROM,
        to: payload.to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Resend API error: HTTP ${response.status}`);
    }

    const result = await response.json();

    // Optionally notify platform owner of critical events
    if (PLATFORM_OWNER_EMAIL && ["artist_profile_submitted", "commission_created"].includes(payload.type)) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: PLATFORM_EMAIL_FROM,
          to: PLATFORM_OWNER_EMAIL,
          subject: `[Atelier] ${subject}`,
          html: `<p>Powiadomienie typu <strong>${payload.type}</strong> zostało wysłane do <strong>${payload.to}</strong>.</p><br>${html}`,
        }),
      }).catch(() => {});
    }

    return new Response(
      JSON.stringify({ id: result.id, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
