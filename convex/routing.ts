import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

// Query to get all active routing rules
export const getRoutingRules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("routingRules")
      .collect();
  },
});

// Query to get only active routing rules
export const getActiveRoutingRules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("routingRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Mutation to create a routing rule
export const createRoutingRule = mutation({
  args: {
    name: v.string(),
    keywords: v.array(v.string()),
    priority: v.number(),
    responseTemplate: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("routingRules", {
      name: args.name,
      keywords: args.keywords,
      priority: args.priority,
      responseTemplate: args.responseTemplate,
      isActive: args.isActive,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to update a routing rule
export const updateRoutingRule = mutation({
  args: {
    ruleId: v.id("routingRules"),
    name: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    priority: v.optional(v.number()),
    responseTemplate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { ruleId, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = { updatedAt: Date.now() };

    if (updates.name !== undefined) filteredUpdates.name = updates.name;
    if (updates.keywords !== undefined) filteredUpdates.keywords = updates.keywords;
    if (updates.priority !== undefined) filteredUpdates.priority = updates.priority;
    if (updates.responseTemplate !== undefined) filteredUpdates.responseTemplate = updates.responseTemplate;
    if (updates.isActive !== undefined) filteredUpdates.isActive = updates.isActive;

    await ctx.db.patch(ruleId, filteredUpdates);
    return { success: true };
  },
});

// Mutation to delete a routing rule
export const deleteRoutingRule = mutation({
  args: {
    ruleId: v.id("routingRules"),
  },
  handler: async (ctx, { ruleId }) => {
    await ctx.db.delete(ruleId);
    return { success: true };
  },
});

// Internal query to find matching rule for tweet text
export const matchTweetToRule = internalQuery({
  args: {
    tweetText: v.string(),
  },
  handler: async (ctx, { tweetText }) => {
    const rules = await ctx.db
      .query("routingRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const lowerText = tweetText.toLowerCase();

    // Find all matching rules and return the one with highest priority
    const matchingRules = rules.filter((rule) =>
      rule.keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()))
    );

    if (matchingRules.length === 0) {
      return null;
    }

    // Sort by priority (higher priority first)
    matchingRules.sort((a, b) => b.priority - a.priority);
    return matchingRules[0];
  },
});

// Helper function to find matching rule (inline to avoid circular refs)
async function findMatchingRule(ctx: { db: any }, tweetText: string) {
  const rules = await ctx.db
    .query("routingRules")
    .withIndex("by_active", (q: any) => q.eq("isActive", true))
    .collect();

  const lowerText = tweetText.toLowerCase();

  const matchingRules = rules.filter((rule: Doc<"routingRules">) =>
    rule.keywords.some((keyword: string) => lowerText.includes(keyword.toLowerCase()))
  );

  if (matchingRules.length === 0) {
    return null;
  }

  matchingRules.sort((a: Doc<"routingRules">, b: Doc<"routingRules">) => b.priority - a.priority);
  return matchingRules[0] as Doc<"routingRules">;
}

// Internal mutation to process batch routing (called from http.ts)
export const processBatchRouting = internalMutation({
  args: {
    tweetIds: v.array(v.id("tweets")),
  },
  handler: async (ctx, { tweetIds }): Promise<Array<{ tweetId: Id<"tweets">; success: boolean; status?: string; error?: string; matchedRule?: string }>> => {
    const results: Array<{ tweetId: Id<"tweets">; success: boolean; status?: string; error?: string; matchedRule?: string }> = [];

    for (const tweetId of tweetIds) {
      const tweet = await ctx.db.get(tweetId);
      if (!tweet) {
        results.push({ tweetId, success: false, error: "Tweet not found" });
        continue;
      }

      // Skip if already processed
      if (tweet.routingStatus && tweet.routingStatus !== "pending") {
        results.push({ tweetId, success: true, status: "already_processed" });
        continue;
      }

      // Find matching rule
      const matchingRule = await findMatchingRule(ctx, tweet.text);

      if (!matchingRule) {
        // No matching rule - mark as skipped
        await ctx.db.patch(tweetId, {
          routingStatus: "skipped",
        });
        results.push({ tweetId, success: true, status: "skipped" });
        continue;
      }

      // Create pending response
      await ctx.db.insert("tweetResponses", {
        originalTweetId: tweet.tweetId,
        routingRuleId: matchingRule._id,
        responseText: matchingRule.responseTemplate,
        status: "pending",
        createdAt: Date.now(),
      });

      // Update tweet with routing info
      await ctx.db.patch(tweetId, {
        routingStatus: "routed",
        matchedRuleId: matchingRule._id,
      });

      results.push({
        tweetId,
        success: true,
        status: "routed",
        matchedRule: matchingRule.name,
      });
    }

    return results;
  },
});

// Mutation to initialize default routing rules
export const initializeDefaultRules = mutation({
  args: {},
  handler: async (ctx) => {
    const existingRules = await ctx.db.query("routingRules").collect();
    if (existingRules.length > 0) {
      return { success: false, message: "Rules already exist" };
    }

    const now = Date.now();
    const defaultRules = [
      {
        name: "Medical Refund",
        keywords: ["medical", "sickness", "not fit to fly", "sick", "hospital", "humanitarian", "health", "doctor", "emergency", "illness"],
        priority: 10,
        responseTemplate: "Dear passenger, we understand you're facing a medical situation. Please DM us your booking reference (PNR) and medical documents for refund assistance. ^Team IndiGo",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Baggage Issue",
        keywords: ["baggage", "luggage", "lost bag", "damaged bag", "missing luggage"],
        priority: 8,
        responseTemplate: "Dear passenger, we apologize for the baggage inconvenience. Please share your PNR and file reference via DM. ^Team IndiGo",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Flight Delay",
        keywords: ["delay", "cancelled", "late", "missed connection", "rescheduled"],
        priority: 6,
        responseTemplate: "Dear passenger, we apologize for the delay. Please share your flight number and PNR via DM. ^Team IndiGo",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const rule of defaultRules) {
      await ctx.db.insert("routingRules", rule);
    }

    return { success: true, message: "Default rules initialized" };
  },
});

// Query to get tweets with their routing status
export const getTweetsWithRouting = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, { status }) => {
    let tweets;
    if (status) {
      tweets = await ctx.db
        .query("tweets")
        .withIndex("by_routing_status", (q) => q.eq("routingStatus", status))
        .order("desc")
        .collect();
    } else {
      tweets = await ctx.db
        .query("tweets")
        .order("desc")
        .collect();
    }

    // Enrich with matched rule info
    const enrichedTweets = await Promise.all(
      tweets.map(async (tweet) => {
        let matchedRule = null;
        if (tweet.matchedRuleId) {
          matchedRule = await ctx.db.get(tweet.matchedRuleId);
        }

        // Get any pending response
        const pendingResponse = await ctx.db
          .query("tweetResponses")
          .withIndex("by_original_tweet", (q) => q.eq("originalTweetId", tweet.tweetId))
          .first();

        return {
          ...tweet,
          matchedRule: matchedRule
            ? { name: matchedRule.name, template: matchedRule.responseTemplate }
            : null,
          pendingResponse: pendingResponse
            ? { _id: pendingResponse._id, status: pendingResponse.status, text: pendingResponse.responseText }
            : null,
        };
      })
    );

    return enrichedTweets;
  },
});
