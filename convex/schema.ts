import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Portfolio projects
  portfolio: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    sector: v.string(), // "dining", "qsr", "stadiums", "corporate", "brewery", "institutional"
    services: v.array(v.string()),
    materials: v.array(v.string()),
    clientName: v.string(),
    location: v.optional(v.string()),
    year: v.optional(v.number()),
    featured: v.boolean(),
    published: v.boolean(),
    images: v.array(v.string()),
    coverImage: v.optional(v.string()),
    caseStudy: v.optional(v.string()),
  }).index("by_sector", ["sector"]).index("by_slug", ["slug"]).index("by_featured", ["featured"]),

  // Quote requests
  quoteRequests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    projectType: v.string(),
    sector: v.optional(v.string()),
    description: v.string(),
    budget: v.optional(v.string()),
    timeline: v.optional(v.string()),
    fileUrls: v.optional(v.array(v.string())),
    status: v.string(), // "new", "reviewing", "quoted", "won", "lost"
    notes: v.optional(v.string()),
    read: v.boolean(),
  }).index("by_status", ["status"]).index("by_read", ["read"]),

  // Contact submissions
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    read: v.boolean(),
    replied: v.boolean(),
  }).index("by_read", ["read"]),

  // Store products
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    price: v.number(),
    category: v.string(), // "bar-tops", "countertops", "shelving", "custom", "accessories"
    material: v.string(),
    finish: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    leadTime: v.optional(v.string()),
    inStock: v.boolean(),
    published: v.boolean(),
    images: v.array(v.string()),
    stripeProductId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    featured: v.boolean(),
  }).index("by_slug", ["slug"]).index("by_category", ["category"]),

  // Orders
  orders: defineTable({
    userId: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    subtotal: v.number(),
    total: v.number(),
    status: v.string(), // "pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    shippingName: v.optional(v.string()),
    shippingEmail: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_userId", ["userId"]).index("by_status", ["status"]),

  // Blog posts
  blog: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
  }).index("by_slug", ["slug"]).index("by_published", ["published"]),

  // Newsletter subscribers
  newsletter: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    subscribed: v.boolean(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),

  // Leads (admin CRM)
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.string(), // "new", "contacted", "qualified", "proposal", "won", "lost"
    notes: v.optional(v.string()),
    value: v.optional(v.number()),
    website: v.optional(v.string()),
  }).index("by_status", ["status"]),

  // Email replies log
  emailReplies: defineTable({
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    sourceType: v.string(),
    sourceId: v.string(),
    sentAt: v.number(),
  }),

  // User roles
  userRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Site settings
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
