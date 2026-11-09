import { END } from "@langchain/langgraph";
import { describeLearner } from "../learner.js";

// Plain code, no LLM call: stop early when a prerequisite is missing.
export function gate({ clarification, answers, level, ageGroup }) {
  const missing = clarification.questions.find(
    (q) => q.blockingChoice && answers[q.id] === q.blockingChoice,
  );
  if (missing) {
    return { stopReason: `Learn ${missing.prerequisite ?? "the basics"} first. It is a prerequisite for what you asked about.` };
  }
  const answered = clarification.questions.map((q) => `${q.text} -> ${answers[q.id] ?? "no answer"}`);
  const profile = [describeLearner(level, ageGroup), ...answered].join("\n");
  return { profile };
}

export const routeAfterGate = (state) => (state.stopReason ? END : ["advocateA", "advocateB"]);
