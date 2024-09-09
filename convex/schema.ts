import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  }).index("by_email", ["email"]),

  messages: defineTable({
    content: v.string(),
    createdAt: v.string(),
    userId: v.id("users"),
  }).index("by_createdAt", ["createdAt"]),

  researchChats: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    response: v.optional(v.string()),
    createdAt: v.string(),
  }),
});
