async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const startDecision = (question, level, ageGroup) => post("/api/decide", { question, level, ageGroup });
export const sendAnswers = (threadId, answers) => post(`/api/decide/${threadId}/answers`, { answers });
