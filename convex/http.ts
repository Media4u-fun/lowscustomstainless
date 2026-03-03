import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { internal } from "./_generated/api";
import Stripe from "stripe";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

const http = httpRouter();

// Register Better Auth routes with CORS enabled for client-side access
authComponent.registerRoutes(http, createAuth, {
  cors: {
    allowedOrigins: [siteUrl, "http://localhost:3000", "http://localhost:3001", "https://lowscustomstainless.vercel.app"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Stripe webhook endpoint
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
      console.error("Missing Stripe environment variables");
      return new Response("Server configuration error", { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-01-28.clover" });
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.mode === "payment") {
            // Check if this is a Website Factory deposit
            if (session.metadata?.type === "website-factory-deposit") {
              await ctx.runMutation(internal.leads.createLeadFromDeposit, {
                name: session.metadata.name,
                businessName: session.metadata.businessName,
                email: session.metadata.email,
                phone: session.metadata.phone || undefined,
                location: session.metadata.location || undefined,
                industry: session.metadata.industry,
                website: session.metadata.website || undefined,
                notes: session.metadata.message || "Applied via /apply landing page with $50 deposit",
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string,
                depositAmount: 5000,
              });
              break;
            }

            console.log("Payment completed:", session.id);
          } else if (session.mode === "subscription") {
            console.log("Subscription checkout completed:", session.id);
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error processing webhook:", err);
      return new Response("Webhook processing error", { status: 500 });
    }
  }),
});

export default http;
