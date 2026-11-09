import { ChatOpenAI } from "@langchain/openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing. Add it to backend/.env");
}

// One shared model for every agent; agents differ only by prompt.
// maxTokens is kept small on purpose: every agent answers in a few lines.
export const llm = new ChatOpenAI({
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  maxTokens: 300,
});

export const tokensOf = (message) => message?.usage_metadata?.total_tokens ?? 0;
