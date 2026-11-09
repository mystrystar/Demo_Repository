import { Annotation } from "@langchain/langgraph";

export const DecisionState = Annotation.Root({
  question: Annotation,
  level: Annotation,
  ageGroup: Annotation,
  clarification: Annotation,
  answers: Annotation,
  stopReason: Annotation,
  profile: Annotation,
  // Both advocates write here in parallel, so merge instead of overwrite.
  arguments: Annotation({ reducer: (a, b) => ({ ...a, ...b }), default: () => ({}) }),
  verdict: Annotation,
  tokens: Annotation({ reducer: (a, b) => a + b, default: () => 0 }),
});
