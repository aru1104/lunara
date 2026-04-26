import { useState } from "react";
import { sendChat } from "../api";

const suggestions = [
  "What does my PCOD score mean?",
  "Is my cycle length normal?",
  "What are early signs of PCOD?",
  "How can I track symptoms better?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "luna", text: "Hi! I'm Luna, your personal health assistant. Ask me anything about your cycle or PCOD risk." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const { reply } = await sendChat(text);
    setMessages(m => [...m, { role: "luna", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col" style={{height: "80vh"}}>
      <h1 className="text-2xl font-semibold text-purple-100 mb-6">Luna AI</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-purple-700 text-white"
                : "bg-white/5 border border-purple-800/40 text-purple-100"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-purple-800/40 rounded-2xl px-4 py-3 text-purple-400 text-sm">
              Luna is typing...
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-purple-800/40 text-purple-300 hover:border-teal-500 hover:text-teal-300 transition">
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask Luna anything..."
          className="flex-1 bg-white/5 border border-purple-800/40 rounded-xl px-4 py-2.5 text-purple-100 focus:outline-none focus:border-purple-500 text-sm"
        />
        <button onClick={() => send()}
          className="bg-teal-700 hover:bg-teal-600 transition px-5 py-2.5 rounded-xl text-white text-sm font-medium">
          Send
        </button>
      </div>
    </div>
  );
}