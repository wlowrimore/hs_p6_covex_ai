import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, args);
      return user._id;
    } else {
      return await ctx.db.insert("users", args);
    }
  },
});

export const listMessages = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const getMessagesWithUsers = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId);
        const updatedUser = {
          ...user,
          id: user?._id,
        };
        return { ...message, user: updatedUser };
      })
    );
    return messagesWithUsers;
  },
});

export const addMessage = mutation({
  args: {
    content: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      createdAt: Date.now().toString(),
      userId: args.userId,
    });
    return messageId;
  },
});

export const saveResearchChat = mutation({
  args: {
    userId: v.id("users"),
    prompt: v.string(),
    response: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const researchChatId = await ctx.db.insert("researchChats", {
      userId: args.userId,
      prompt: args.prompt,
      response: args.response,
      createdAt: Date.now().toString(),
    });
    return researchChatId;
  },
});

export const listResearchChats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("researchChats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});
