import express from "express";
import decideRouter from "./routes/decide.js";

const app = express();
app.use(express.json());
app.use("/api/decide", decideRouter);

// Express 5 forwards errors from async handlers here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
