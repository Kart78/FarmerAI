import { useState } from "react";
import { Send, Sprout, CloudRain, TrendingDown } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { INSIGHTS } from "../data/mock.js";

const iconFor = (veg) => (veg === "Rain" ? CloudRain : veg === "Onion" ? TrendingDown : Sprout);

export default function AiAssistant({ setScreen, openMenu }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Good Morning, Karthi! Here are today's smart insights." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content: `You are a farm copilot for an Indian farmer named Karthi who sells tomatoes, onions, spinach and other vegetables directly to buyers. Answer briefly and practically in under 80 words. Question: ${text}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n") || "Sorry, I couldn't get a response.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Couldn't reach the assistant right now." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <ScreenHeader title="AI Assistant" setScreen={setScreen} openMenu={openMenu} />
      <h1 className="text-xl font-display font-semibold text-stone-800 mb-4">AI Assistant</h1>

      <div className="space-y-2 mb-4">
        {INSIGHTS.map((i) => {
          const Icon = iconFor(i.veg);
          return (
            <div key={i.text} className="bg-white border border-stone-200 rounded-xl p-3 flex gap-3">
              <Icon size={18} className="text-farm-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-stone-700">{i.text}</p>
                {i.extra && <p className="text-xs text-farm-700 font-semibold mt-0.5">{i.extra}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-stone-200 rounded-card flex flex-col h-72 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] text-sm px-3 py-2 rounded-xl ${
                m.role === "user" ? "bg-farm-800 text-white ml-auto" : "bg-stone-100 text-stone-800"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="text-xs text-stone-400">Thinking…</div>}
        </div>
        <div className="flex gap-2 p-2 border-t border-stone-100">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask me anything..."
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={send} className="bg-farm-800 text-white rounded-lg px-3">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
