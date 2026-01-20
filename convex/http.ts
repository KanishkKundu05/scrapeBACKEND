import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// GET handler for Twitter webhook URL verification
http.route({
  path: "/twitter-webhook",
  method: "GET",
  handler: httpAction(async () => {
    return new Response("OK", { status: 200 });
  }),
});

// POST handler for receiving tweets
http.route({
  path: "/twitter-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. Parse JSON body (return 200 for empty body - verification request)
    let payload;
    try {
      const text = await request.text();
      if (!text) {
        return new Response(
          JSON.stringify({ success: true, message: "Webhook verified" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      payload = JSON.parse(text);
    } catch {
      // Return 200 for parse errors during verification
      return new Response(
        JSON.stringify({ success: true, message: "Webhook verified" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Validate required fields (return 200 if missing - likely verification)
    const requiredFields = ["event_type", "rule_id", "rule_tag", "tweets", "timestamp"];
    for (const field of requiredFields) {
      if (!(field in payload)) {
        return new Response(
          JSON.stringify({ success: true, message: "Webhook verified" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (!Array.isArray(payload.tweets)) {
      return new Response(
        JSON.stringify({ success: true, message: "Webhook verified" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Normalize tweets to match validator schema (API uses camelCase)
    const normalizedTweets = payload.tweets.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      author: {
        id: tweet.author.id,
        userName: tweet.author.userName,
        name: tweet.author.name,
      },
      created_at: tweet.createdAt || tweet.created_at || "",
      retweet_count: tweet.retweetCount ?? tweet.retweet_count ?? 0,
      like_count: tweet.likeCount ?? tweet.like_count ?? 0,
      reply_count: tweet.replyCount ?? tweet.reply_count ?? 0,
    }));

    // 4. Call internal mutation to store tweets
    try {
      const result = await ctx.runMutation(internal.twitter.storeTweets, {
        payload: {
          event_type: payload.event_type,
          rule_id: payload.rule_id,
          rule_tag: payload.rule_tag,
          tweets: normalizedTweets,
          timestamp: payload.timestamp,
        },
      });

      // 5. Return success response with counts
      return new Response(
        JSON.stringify({
          success: true,
          inserted: result.insertedCount,
          skipped: result.skippedCount,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error storing tweets:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store tweets" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
