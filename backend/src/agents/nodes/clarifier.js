import { z } from "zod";
import { llm, tokensOf } from "../llm.js";
import { CLARIFIER } from "../prompts.js";
import { describeLearner } from "../learner.js";

const Clarification = z.object({
  options: z.array(z.string()).describe("Exactly the 2 options being compared"),
  relation: z.enum(["dependent", "complementary", "independent"]),
  prerequisites: z.array(z.object({ option: z.string(), needs: z.array(z.string()) })),
  questions: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        choices: z.array(z.string()),
        blockingChoice: z.string().nullable(),
        prerequisite: z.string().nullable(),
      }),
    )
    .describe("At most 3 questions, basic to advanced"),
});

const structured = llm.withStructuredOutput(Clarification, { name: "clarification", includeRaw: true });

export async function clarifier({ question, level, ageGroup }) {
  const { raw, parsed } = await structured.invoke([
    ["system", CLARIFIER],
    ["user", `${describeLearner(level, ageGroup)}\nQuestion: ${question}`],
  ]);
  return { clarification: parsed, tokens: tokensOf(raw) };
}
