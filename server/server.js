// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// URL de Ollama (local)
const OLLAMA_BASE = process.env.OLLAMA_BASE || "http://localhost:11434";

// Endpoint simple para chat
// Recibe: { messages: [{role:'user'|'assistant'|'system', content: '...'}], model?: 'llama3.2' }
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model = "llama3.2", stream = false } = req.body;

    // Validaciones básicas
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    // Llamada a Ollama /api/chat (no streaming aquí para simplificar)
    const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    // La respuesta usualmente viene en data (ver docs del endpoint).
    return res.json(data);
  } catch (err) {
    console.error("Error en /api/chat:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint opcional: generar a partir de prompt simple
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, model = "llama3.2" } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Error en /api/generate:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Proxy server listening at http://localhost:${PORT}`);
});
