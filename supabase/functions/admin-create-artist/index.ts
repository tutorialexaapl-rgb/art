import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ż/g, "z").replace(/ź/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generatePassword(length = 16): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

interface CreateArtistPayload {
  email: string;
  password?: string;
  artistName: string;
  bio?: string;
  location?: string;
  styles?: string[];
  techniques?: string[];
  specializations?: string[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  averageDeliveryDays?: number;
  yearsExperience?: number;
  instagram?: string;
  website?: string;
  avatarUrl?: string;
  coverUrl?: string;
}

async function verifyAdmin(authHeader: string): Promise<boolean> {
  if (!authHeader || !SUPABASE_URL || !SERVICE_ROLE_KEY) return false;
  const token = authHeader.replace("Bearer ", "");
  if (!token) return false;

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "apikey": SERVICE_ROLE_KEY,
    },
  });
  if (!res.ok) return false;
  const user = await res.json();
  if (!user?.id) return false;

  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=role`,
    {
      headers: {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!profileRes.ok) return false;
  const profiles = await profileRes.json();
  return Array.isArray(profiles) && profiles.length > 0 && profiles[0].role === "admin";
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
    const isAdmin = await verifyAdmin(authHeader);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Brak uprawnień. Wymagana rola admin." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body: CreateArtistPayload = await req.json();
    const {
      email,
      password: providedPassword,
      artistName,
      bio = "",
      location = "",
      styles = [],
      techniques = [],
      specializations = [],
      priceRangeMin = 0,
      priceRangeMax = 0,
      averageDeliveryDays = 14,
      yearsExperience = 0,
      instagram = "",
      website = "",
      avatarUrl = null,
      coverUrl = null,
    } = body;

    if (!email || !artistName) {
      return new Response(
        JSON.stringify({ error: "Brak wymaganego pola: email, artistName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const password = providedPassword || generatePassword();
    const slug = slugify(artistName);

    // 1. Create auth user
    const createUserRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "apikey": SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { displayName: artistName },
      }),
    });

    if (!createUserRes.ok) {
      const err = await createUserRes.json().catch(() => ({}));
      throw new Error(err.msg || err.message || `Nie udało się utworzyć konta: HTTP ${createUserRes.status}`);
    }

    const authUser = await createUserRes.json();
    const userId = authUser.id;

    if (!userId) {
      throw new Error("Nie udało się pobrać ID nowego użytkownika.");
    }

    // 2. Insert profile row
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        id: userId,
        email,
        role: "artist",
        status: "approved",
        display_name: artistName,
        avatar_url: avatarUrl,
        bio,
        location,
        instagram: instagram || null,
        website: website || null,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        email_normalized: email.toLowerCase(),
      }),
    });

    if (!profileRes.ok) {
      const err = await profileRes.json().catch(() => ({}));
      // Cleanup: delete the auth user we just created
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${SERVICE_ROLE_KEY}`, "apikey": SERVICE_ROLE_KEY },
      }).catch(() => {});
      throw new Error(err.message || "Nie udało się utworzyć wiersza w profiles.");
    }

    // 3. Insert artist_profile row
    const artistProfileRes = await fetch(`${SUPABASE_URL}/rest/v1/artist_profiles`, {
      method: "POST",
      headers: {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        user_id: userId,
        slug,
        artist_name: artistName,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        bio,
        location,
        styles,
        techniques,
        specializations,
        price_range_min: priceRangeMin,
        price_range_max: priceRangeMax,
        average_delivery_days: averageDeliveryDays,
        approval_status: "approved",
        is_verified: false,
        years_experience: yearsExperience,
        website: website || null,
        instagram: instagram || null,
      }),
    });

    if (!artistProfileRes.ok) {
      const err = await artistProfileRes.json().catch(() => ({}));
      // Cleanup: delete profile + auth user
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method: "DELETE",
        headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}` },
      }).catch(() => {});
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${SERVICE_ROLE_KEY}`, "apikey": SERVICE_ROLE_KEY },
      }).catch(() => {});
      throw new Error(err.message || "Nie udało się utworzyć wiersza w artist_profiles.");
    }

    const artistProfile = await artistProfileRes.json();
    const artistProfileId = artistProfile?.[0]?.id;

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        artistProfileId,
        slug,
        generatedPassword: providedPassword ? undefined : password,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
