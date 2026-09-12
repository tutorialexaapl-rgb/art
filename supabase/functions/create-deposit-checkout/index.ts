import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const SITE_URL = Deno.env.get("SITE_URL") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { projectId, amount, phase } = await req.json();

    if (!projectId || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Brak wymaganego parametru: projectId, amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          error: "Stripe nie jest skonfigurowany. Ustaw STRIPE_SECRET_KEY w Supabase Edge Function secrets.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const successUrl = `${SITE_URL}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}&phase=deposit&project_id=${projectId}`;
    const cancelUrl = `${SITE_URL}/dashboard/payment/cancel?phase=deposit&project_id=${projectId}`;

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "line_items[0][price_data][currency]": "pln",
        "line_items[0][price_data][product_data][name]": "Zaliczka za obraz na zamówienie",
        "line_items[0][price_data][unit_amount]": String(Math.round(amount * 100)),
        "line_items[0][quantity]": "1",
        "success_url": successUrl,
        "cancel_url": cancelUrl,
        "metadata[project_id]": projectId,
        "metadata[phase]": "deposit",
        "client_reference_id": projectId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Stripe API error");
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
