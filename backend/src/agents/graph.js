import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { DecisionState } from "./state.js";
import { clarifier } from "./nodes/clarifier.js";
import { human } from "./nodes/human.js";
import { gate, routeAfterGate } from "./nodes/gate.js";
import { advocateA, advocateB } from "./nodes/advocate.js";
import { judge } from "./nodes/judge.js";

// clarifier -> human (pause) -> gate -> [advocateA, advocateB] in parallel -> judge
export const graph = new StateGraph(DecisionState)
  .addNode("clarifier", clarifier)
  .addNode("human", human)
  .addNode("gate", gate)
  .addNode("advocateA", advocateA)
  .addNode("advocateB", advocateB)
  .addNode("judge", judge)
  .addEdge(START, "clarifier")
  .addEdge("clarifier", "human")
  .addEdge("human", "gate")
  .addConditionalEdges("gate", routeAfterGate, ["advocateA", "advocateB", END])
  .addEdge(["advocateA", "advocateB"], "judge")
  .addEdge("judge", END)
  // In-memory checkpoints keep paused runs between the two HTTP calls.
  .compile({ checkpointer: new MemorySaver() });
