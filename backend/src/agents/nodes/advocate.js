import { llm, tokensOf } from "../llm.js";
import { advocate } from "../prompts.js";

// Each advocate argues for one option and never sees the other's argument.
const makeAdvocate = (index) => async ({ clarification, profile }) => {
  const [first, second] = clarification.options;
  const [mine, other] = index === 0 ? [first, second] : [second, first];
  const message = await llm.invoke([
    ["system", advocate(mine, other)],
    ["user", `Learner profile:\n${profile}`],
  ]);
  return { arguments: { [mine]: message.content }, tokens: tokensOf(message) };
};

export const advocateA = makeAdvocate(0);
export const advocateB = makeAdvocate(1);
