import { interrupt } from "@langchain/langgraph";

// Pauses the graph until the user answers. On resume, interrupt() returns the answers.
export function human({ clarification }) {
  const answers = interrupt({ questions: clarification.questions });
  return { answers };
}
