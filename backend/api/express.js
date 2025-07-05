const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express on Vercel 🔥" });
});

module.exports.handler = serverless(app);
