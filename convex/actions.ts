import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResearchResponses = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate summarized responses for prompts entered by a user.  Please use reputable sources, and at the end of the summarized response, please include 1 to 3 reference links that are formatted to not be in Markdown format.  The user should be able to click the links and be redirected to the source in a new tab. Please attempt to return the most thorough responses you can, and if you can't find any information on the prompt subject return 'I'm sorry, I couldn't find any information on that subject.'",
        },
        {
          role: "user",
          content: args.prompt,
        },
      ],
    });
    const content = response.choices[0].message.content;
    return content;
  },
});
