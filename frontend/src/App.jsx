import { useState } from "react";
import { startDecision, sendAnswers } from "./api.js";

const LEVELS = ["beginner", "intermediate", "expert"];
const AGE_GROUPS = { kid: "8-12", teen: "13-17", student: "18-24", adult: "25+" };

export default function App() {
  const [question, setQuestion] = useState("What should I learn next, Node.js or React?");
  const [level, setLevel] = useState("beginner");
  const [ageGroup, setAgeGroup] = useState("student");
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(task) {
    setLoading(true);
    setError("");
    try {
      await task();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const ask = (e) => {
    e.preventDefault();
    run(async () => {
      setResult(null);
      setAnswers({});
      setSession(await startDecision(question, level, ageGroup));
    });
  };

  const submit = (e) => {
    e.preventDefault();
    run(async () => setResult(await sendAnswers(session.threadId, answers)));
  };

  const reset = () => {
    setSession(null);
    setResult(null);
    setAnswers({});
  };

  const allAnswered = session?.questions.every((q) => answers[q.id]);

  return (
    <main>
      <h1>Decision Helper</h1>
      <p className="muted">A clarifier checks your level, two advocates argue, a judge decides.</p>

      {!session && (
        <form onSubmit={ask} className="card">
          <label htmlFor="question">What are you deciding?</label>
          <input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <div className="row">
            <label>
              Your level
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Age group
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                {Object.entries(AGE_GROUPS).map(([key, range]) => (
                  <option key={key} value={key}>
                    {key} ({range})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button disabled={loading || !question.trim()}>{loading ? "Thinking..." : "Ask"}</button>
        </form>
      )}

      {session && !result && (
        <form onSubmit={submit} className="card">
          <p>
            <strong>{session.options.join(" vs ")}</strong> <span className="tag">{session.relation}</span>
          </p>
          <ul className="muted">
            {session.prerequisites.map((p) => (
              <li key={p.option}>
                {p.option} needs: {p.needs.join(", ")}
              </li>
            ))}
          </ul>
          {session.questions.map((q) => (
            <fieldset key={q.id}>
              <legend>{q.text}</legend>
              {q.choices.map((choice) => (
                <label key={choice} className="choice">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === choice}
                    onChange={() => setAnswers({ ...answers, [q.id]: choice })}
                  />
                  {choice}
                </label>
              ))}
            </fieldset>
          ))}
          <button disabled={loading || !allAnswered}>{loading ? "Agents are debating..." : "Submit answers"}</button>
        </form>
      )}

      {result?.status === "stopped" && (
        <section className="card">
          <h2>Start with the basics</h2>
          <p>{result.message}</p>
        </section>
      )}

      {result?.status === "done" && (
        <>
          <div className="grid">
            {Object.entries(result.arguments).map(([option, text]) => (
              <section key={option} className="card">
                <h2>Case for {option}</h2>
                <p className="pre">{text}</p>
              </section>
            ))}
          </div>
          <section className="card verdict">
            <h2>Judge</h2>
            <p className="pre">{result.verdict}</p>
          </section>
        </>
      )}

      {result && (
        <p className="muted">
          Tokens used: {result.tokens} · <button className="link" onClick={reset}>Ask another</button>
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </main>
  );
}
