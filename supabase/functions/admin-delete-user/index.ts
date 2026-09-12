import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

async function verifyAdmin(authHeader: string): Promise<{ id: string; role: string } | null> {
  if (!authHeader || !SUPABASE_URL || !SERVICE_ROLE_KEY) return null;
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "apikey": SERVICE_ROLE_KEY,
    },
  });
  if (!res.ok) return null;
  const user = await res.json();
  if (!user?.id) return null;

  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=role,id`,
    {
      headers: {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!profileRes.ok) return null;
  const profiles = await profileRes.json();
  if (!Array.isArray(profiles) || profiles.length === 0) return null;
  if (profiles[0].role !== "admin") return null;
  return { id: user.id, role: profiles[0].role };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Brak klucza service_role." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const admin = await verifyAdmin(authHeader);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Brak uprawnień. Wymagana rola admin." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { userId, reason } = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Brak wymaganego pola: userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (userId === admin.id) {
      return new Response(
        JSON.stringify({ error: "Nie można usunąć własnego konta." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminHeaders = {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    // 1. Fetch the profile to log who was deleted
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
      { headers: adminHeaders },
    );
    const profileRows = await profileRes.json();
    const profile = Array.isArray(profileRows) && profileRows.length > 0 ? profileRows[0] : null;

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Użytkownik nie istnieje." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Insert audit log BEFORE deleting (FK to profiles still valid)
    await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs`, {
      method: "POST",
      headers: { ...adminHeaders, "Prefer": "return=minimal" },
      body: JSON.stringify({
        admin_id: admin.id,
        action: "delete_user",
        target_type: "user",
        target_id: userId,
        details: `Trwale usunięto konto: ${profile.display_name} (${profile.email}). Powód: ${reason || "brak"}`,
      }),
    });

    // 3. Delete profile row — ON DELETE CASCADE removes artist_profiles,
    //    client_profiles, portfolio items, consent_records, commission_comments,
    //    commission_offers, commission_projects, commission_requests,
    //    conversations, messages.
    //    Tables with SET NULL FKs (admin_audit_logs, moderation_reports,
    //    moderation_events, commission_status_history, commission_attachments,
    //    milestone_attachments, platform_settings) are handled automatically
    //    by the database — no manual cleanup needed.

    // 4. Delete the profile row
    const deleteProfileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
      { method: "DELETE", headers: adminHeaders },
    );
    if (!deleteProfileRes.ok) {
      const err = await deleteProfileRes.json().catch(() => ({}));
      throw new Error(err.message || "Nie udało się usunąć wiersza w profiles.");
    }

    // 5. Delete the auth user
    const deleteAuthRes = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      { method: "DELETE", headers: adminHeaders },
    );
    if (!deleteAuthRes.ok) {
      // Profile is already deleted — log but don't fail
      console.error("Failed to delete auth user:", await deleteAuthRes.text().catch(() => ""));
    }

    return new Response(
      JSON.stringify({ success: true, userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
