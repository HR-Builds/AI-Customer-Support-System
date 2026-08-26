import { useEffect, useState } from "react";
import { Plus, X, Ticket as TicketIcon } from "lucide-react";
import { AppShellHeader } from "../components/AppShellHeader";
import { api } from "../lib/api";

const PRIORITIES = ["low", "medium", "high"];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await api.listTickets();
        setTickets(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate(payload) {
    const ticket = await api.createTicket(payload);
    setTickets((prev) => [ticket, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="h-screen flex flex-col bg-ink">
      <AppShellHeader active="tickets" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h1 className="font-display text-2xl font-medium text-paper">Tickets</h1>
              <p className="text-sm text-muted mt-1">
                Anything that needed a human hand, tracked from open to resolved.
              </p>
            </div>
            <button
              onClick={() => setShowForm((s) => !s)}
              className="inline-flex items-center gap-2 bg-nova hover:bg-nova-dim text-ink font-medium rounded-full px-4 py-2.5 text-sm transition-colors shrink-0"
            >
              {showForm ? <X size={15} /> : <Plus size={15} />}
              {showForm ? "Cancel" : "New ticket"}
            </button>
          </div>

          {error && (
            <div className="mt-6 text-sm text-bad bg-nova-soft/40 border border-bad/30 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {showForm && (
            <TicketForm onSubmit={handleCreate} onError={setError} />
          )}

          <div className="mt-10">
            {loading ? (
              <div className="font-mono text-xs text-muted tracking-widest">LOADING…</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-line rounded-xl">
                <TicketIcon size={22} className="text-faint mx-auto mb-3" />
                <p className="text-sm text-faint">No tickets yet. Raise one when something needs a human.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {tickets.map((t) => (
                  <TicketRow key={t.id} ticket={t} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketForm({ onSubmit, onError }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    onError("");
    try {
      await onSubmit({ subject, description, priority });
      setSubject("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border border-line rounded-xl p-6 bg-surface/60 space-y-4"
    >
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-faint mb-1.5">
          Subject
        </label>
        <input
          type="text"
          required
          minLength={3}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-faint focus:border-nova outline-none transition-colors"
          placeholder="Billing discrepancy on last invoice"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-faint mb-1.5">
          Description
        </label>
        <textarea
          required
          minLength={5}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-faint focus:border-nova outline-none transition-colors"
          placeholder="What happened, and what you'd like to see done about it."
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-faint mb-1.5">
          Priority
        </label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPriority(p)}
              className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
                priority === p
                  ? "border-nova text-nova bg-nova-soft/50"
                  : "border-line text-faint hover:text-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-nova hover:bg-nova-dim disabled:opacity-60 text-ink font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
      >
        {busy ? "Submitting…" : "Submit ticket"}
      </button>
    </form>
  );
}

function TicketRow({ ticket }) {
  const statusColor =
    ticket.status === "open"
      ? "text-warn bg-warn/10"
      : ticket.status === "resolved"
      ? "text-good bg-good/10"
      : "text-muted bg-surface-2";

  return (
    <li className="border border-line rounded-xl p-5 bg-surface/60">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-paper font-medium truncate">{ticket.subject}</div>
          <p className="text-sm text-muted mt-1 leading-relaxed">{ticket.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${statusColor}`}>
            {ticket.status}
          </span>
          <span className="text-xs font-mono text-faint uppercase">{ticket.priority}</span>
        </div>
      </div>
    </li>
  );
}
