import { randomUUID } from "node:crypto";
import { Command } from "@langchain/langgraph";
import { graph } from "./graph.js";

const configFor = (threadId) => ({ configurable: { thread_id: threadId } });

// Runs the clarifier, then stops at the human node and returns its questions.
export async function startDecision({ question, level, ageGroup }) {
  const threadId = randomUUID();
  await graph.invoke({ question, level, ageGroup }, configFor(threadId));
  const { values } = await graph.getState(configFor(threadId));
  const { options, relation, prerequisites, questions } = values.clarification;
  return { threadId, options, relation, prerequisites, questions, tokens: values.tokens };
}

// Resumes the paused run with the user's answers and runs it to the end.
export async function answerDecision(threadId, answers) {
  const paused = await graph.getState(configFor(threadId));
  if (!paused.next.includes("human")) {
    const error = new Error("No decision is waiting for answers with this id");
    error.status = 404;
    throw error;
  }
  const result = await graph.invoke(new Command({ resume: answers }), configFor(threadId));
  if (result.stopReason) {
    return { status: "stopped", message: result.stopReason, tokens: result.tokens };
  }
  return { status: "done", arguments: result.arguments, verdict: result.verdict, tokens: result.tokens };
}
