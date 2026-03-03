import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Promote a user to admin by their auth component user ID.
export const makeAdminById = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!existing) {
      await ctx.db.insert("userRoles", { userId, role: "admin", createdAt: Date.now() });
    } else {
      await ctx.db.patch(existing._id, { role: "admin" });
    }
    return `${userId} is now admin`;
  },
});

// Debug: show current user ID and their role
export const debugAuth = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (!user) return { error: "no user" };
      const userRole = await ctx.db
        .query("userRoles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();
      const allRoles = await ctx.db.query("userRoles").collect();
      return { userId: user._id, userIdType: typeof user._id, userRole, allRoles };
    } catch (e: any) {
      return { error: e.message };
    }
  },
});
