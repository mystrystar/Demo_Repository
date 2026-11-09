import { Router } from "express";
import { startDecision, answerDecision } from "../agents/index.js";
import { LEVELS, AGE_GROUPS } from "../agents/learner.js";

const router = Router();

router.post("/", async (req, res) => {
  const question = req.body?.question?.trim();
  const { level, ageGroup } = req.body ?? {};
  if (!question) return res.status(400).json({ error: "question is required" });
  if (!(level in LEVELS)) return res.status(400).json({ error: `level must be one of: ${Object.keys(LEVELS).join(", ")}` });
  if (!(ageGroup in AGE_GROUPS)) return res.status(400).json({ error: `ageGroup must be one of: ${Object.keys(AGE_GROUPS).join(", ")}` });
  res.json(await startDecision({ question, level, ageGroup }));
});

router.post("/:threadId/answers", async (req, res) => {
  const answers = req.body?.answers;
  if (!answers || typeof answers !== "object") return res.status(400).json({ error: "answers object is required" });
  res.json(await answerDecision(req.params.threadId, answers));
});

export default router;
