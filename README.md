# Decision Helper

Decision Helper helps a learner choose what to study next. Enter a learning question and your experience level and age group; the app asks a few tailored questions, checks for missing prerequisites, and—when appropriate—uses two AI advocates and a judge to produce a recommendation.

## How it works

1. A clarifier identifies two options, their relationship and prerequisites, then creates up to three multiple-choice questions tailored to the learner.
2. The workflow pauses while the learner answers.
3. A prerequisite check may recommend learning the basics first. Otherwise, two advocates make independent cases for the options in parallel, and a judge weighs them and gives a suggested order and explanation.
4. The UI displays the questions, arguments, verdict, and token usage.

The workflow is implemented with LangGraph.js. The backend calls the OpenAI API through LangChain; the browser talks to the backend and does not need the API key.

## Requirements

- Node.js with support for `--env-file-if-exists` (Node.js 22.9 or later recommended)
- npm
- An OpenAI API key

## Getting started

From the repository root:

```powershell
npm install
Copy-Item backend\.env.example backend\.env
```

Edit `backend\.env` and set your key:

```dotenv
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini
PORT=3001
```

Keep `backend\.env` private; it is ignored by Git.

Start both the backend and frontend from the repository root:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The Vite development server proxies `/api` requests to the backend at `http://localhost:3001`.

You can also run either workspace separately:

```powershell
npm run dev:backend
npm run dev:frontend
```

To build the frontend for production:

```powershell
npm run build -w frontend
```

The backend listens on `PORT` (default `3001`). Run it outside development mode with `npm start -w backend`.

## API

All routes are served by the backend under `/api/decide`.

### Start a decision

`POST /api/decide`

```json
{
  "question": "What should I learn next, Node.js or React?",
  "level": "beginner",
  "ageGroup": "student"
}
```

`level` must be `beginner`, `intermediate`, or `expert`. `ageGroup` must be `kid`, `teen`, `student`, or `adult`. The response contains a `threadId`, two options, their relationship, prerequisites, and clarification questions.

### Submit answers

`POST /api/decide/:threadId/answers`

```json
{
  "answers": {
    "question-id": "selected choice"
  }
}
```

The response is either a stopped recommendation to learn a prerequisite first, or a completed result with each advocate's argument, the judge's verdict, and token usage.

## Project structure

```text
backend/
  src/
    agents/       LangGraph workflow, shared state, prompts, and agent nodes
    routes/       Express decision API
    server.js     Backend entry point
frontend/
  src/            React application and API client
  vite.config.js  Development server and backend API proxy
```

## Notes

- Each decision makes multiple model calls. Model availability and usage costs depend on your OpenAI account and selected model.
- Workflow checkpoints use LangGraph's in-memory `MemorySaver`. Active decision threads are not durable and are lost when the backend process restarts.
- The project currently has no automated test script configured.
