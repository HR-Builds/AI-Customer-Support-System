import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShellHeader } from "../components/AppShellHeader";
import { ConversationSidebar } from "../components/ConversationSidebar";
import { ChatWindow } from "../components/ChatWindow";
import { api } from "../lib/api";

export default function Dashboard() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const activeId = conversationId ? Number(conversationId) : null;
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const loadConversations = useCallback(async () => {
    try {
      const list = await api.listConversations();
      setConversations(list);
      return list;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadConversations();
      setLoading(false);
    })();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    (async () => {
      try {
        const msgs = await api.listMessages(activeId);
        setMessages(msgs);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [activeId]);

  async function handleCreate() {
    setCreating(true);
    setError("");
    try {
      const conv = await api.createConversation("New conversation");
      setConversations((prev) => [conv, ...prev]);
      navigate(`/dashboard/${conv.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    const prev = conversations;
    setConversations((cur) => cur.filter((c) => c.id !== id));
    if (activeId === id) navigate("/dashboard");
    try {
      await api.deleteConversation(id);
    } catch (err) {
      setError(err.message);
      setConversations(prev);
    }
  }

  async function handleSend(content) {
    if (!activeId) return;
    const optimisticUser = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);
    setSending(true);
    setError("");
    try {
      const assistantMessage = await api.sendMessage(activeId, content);
      const freshMessages = await api.listMessages(activeId);
      setMessages(freshMessages);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, updated_at: assistantMessage.created_at } : c
        )
      );
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-ink">
      <AppShellHeader active="dashboard" />
      <div className="flex-1 flex min-h-0">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => navigate(`/dashboard/${id}`)}
          onCreate={handleCreate}
          onDelete={handleDelete}
          creating={creating}
        />
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="font-mono text-xs text-muted tracking-widest">LOADING…</div>
          </div>
        ) : (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            onSend={handleSend}
            sending={sending}
          />
        )}
      </div>
      {error && (
        <div className="absolute bottom-4 right-4 bg-surface border border-bad/40 text-bad text-sm rounded-lg px-4 py-2.5 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
