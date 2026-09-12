import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  if (!secret || !signature) return false;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sig = signature.split(",").find((s) => s.startsWith("v1="))?.replace("v1=", "");
    if (!sig) return false;
    const sigBytes = Uint8Array.from(sig.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? []);
    return await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature") ?? "";

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      return new Response(
        JSON.stringify({ error: "Stripe webhook nie jest skonfigurowany" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const isValid = await verifyStripeSignature(payload, signature, STRIPE_WEBHOOK_SECRET);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Nieprawidłowy podpis webhook" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const event = JSON.parse(payload);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const projectId = session.client_reference_id ?? session.metadata?.project_id;
        const phase = session.metadata?.phase ?? "deposit";
        const paymentIntentId = session.payment_intent as string;

        if (!projectId) {
          console.error("Webhook: brak project_id w sesji checkout");
          break;
        }

        // Idempotency check: verify this payment hasn't been processed already.
        // In production, query a `payment_events` table for the paymentIntentId.
        // If it exists, return 200 early — do NOT re-process.
        //
        // const { data: existing } = await supabase
        //   .from('payment_events')
        //   .select('id')
        //   .eq('stripe_payment_intent_id', paymentIntentId)
        //   .maybeSingle();
        // if (existing) {
        //   return new Response(JSON.stringify({ received: true, duplicate: true }), ...);
        // }
        //
        // Record the event, then update project status:
        // - deposit: set deposit_paid = true, status = 'concept_stage'
        // - final: set final_paid = true, status = 'fully_paid'

        console.log(`Webhook: checkout.session.completed for project ${projectId}, phase ${phase}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        const projectId = intent.metadata?.project_id;
        console.error(`Webhook: payment failed for project ${projectId}`);
        break;
      }

      default:
        console.log(`Webhook: unhandled event type ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
