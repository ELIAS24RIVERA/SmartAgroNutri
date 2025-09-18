import React, { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

export default function ChatBot({ systemPrompt }) {
  // messages: array { role, content }
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        systemPrompt ||
        "Eres un asistente experto en sistemas de nutrición para áreas verdes del instituto ISTAP. Responde de forma clara, práctica y con pasos aplicables. ",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // agregar mensaje del usuario localmente
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Llamada al backend
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages, // enviamos todo el contexto
          model: "llama3.2",
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Error en la API");
      }

      const data = await resp.json();
      // Dependiendo del formato devuelto por Ollama, busca la respuesta.
      // A menudo la estructura es: { choices: [{ message: { content: "..." } }] } o { message: { content } }
      const assistantText =
        data?.message?.content ||
        (data?.choices && data.choices[0] && (data.choices[0].message?.content || data.choices[0].content)) ||
        data?.response ||
        JSON.stringify(data);

      const assistantMsg = { role: "assistant", content: assistantText };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", content: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-header">
        <h3>Asistente ISTAP — Nutrición de Áreas Verdes</h3>
      </div>

      <div className="chat-body" ref={scrollRef}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div key={i} className={`chat-message ${m.role}`}>
              <div className="chat-content">{m.content}</div>
            </div>
          ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="chat-content">Escribiendo…</div>
          </div>
        )}
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta sobre nutrición de áreas verdes..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}
