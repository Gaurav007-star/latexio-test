const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const OPENAI_API_KEY = "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";

router.post("/openai-chat", async (req, res) => {
  try {
    const { messages, max_tokens = 800, model = "gpt-3.5-turbo" } = req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model, messages, max_tokens })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;