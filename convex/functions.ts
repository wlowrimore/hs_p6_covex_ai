import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listMessages = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const createMessage = mutation({
  args: {
    sender: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      sender: args.sender,
      text: args.text,
    });
  },
});
