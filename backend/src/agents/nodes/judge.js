import { llm, tokensOf } from "../llm.js";
import { JUDGE } from "../prompts.js";

export async function judge({ question, clarification, profile, arguments: args }) {
  const sides = Object.entries(args)
    .map(([option, text]) => `Case for ${option}:\n${text}`)
    .join("\n\n");
  const message = await llm.invoke([
    ["system", JUDGE],
    ["user", `Question: ${question}\nRelation: ${clarification.relation}\nLearner profile:\n${profile}\n\n${sides}`],
  ]);
  return { verdict: message.content, tokens: tokensOf(message) };
}
