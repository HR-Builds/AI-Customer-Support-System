import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { NovaMark } from "./NovaMark";

export function ChatWindow({ conversation, messages, onSend, sending }) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    onSend(text);
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="mb-4 flex justify-center opacity-50">
            <NovaMark size={28} />
          </div>
          <h2 className="font-display text-lg text-paper mb-1">No conversation open</h2>
          <p className="text-sm text-muted">
            Start a new conversation or pick one from the list to see the thread here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="h-14 border-b border-line-soft flex items-center px-5 shrink-0">
        <div className="min-w-0">
          <h2 className="font-display text-sm font-medium text-paper truncate">
            {conversation.title}
          </h2>
          <p className="text-xs text-faint font-mono">conversation #{conversation.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-faint text-center py-12">
            Say hello — your message goes straight to the support AI.
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-surface-2 border border-line rounded-lg px-3.5 py-2.5 text-sm text-faint font-mono">
              thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-line-soft p-4 flex items-end gap-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={1}
          placeholder="Describe the issue…"
          className="flex-1 resize-none bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-faint focus:border-nova outline-none transition-colors max-h-40"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="shrink-0 bg-nova hover:bg-nova-dim disabled:opacity-40 text-ink rounded-lg p-2.5 transition-colors"
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-surface-3 text-paper"
            : "bg-nova-soft border border-nova-dim/30 text-paper"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
