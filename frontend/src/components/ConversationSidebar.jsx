import { useState } from "react";
import { Plus, Trash2, MessageSquare } from "lucide-react";

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  creating,
}) {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function handleDeleteClick(e, id) {
    e.stopPropagation();
    if (pendingDeleteId === id) {
      onDelete(id);
      setPendingDeleteId(null);
    } else {
      setPendingDeleteId(id);
      setTimeout(() => setPendingDeleteId((cur) => (cur === id ? null : cur)), 2500);
    }
  }

  return (
    <aside className="w-72 border-r border-line-soft flex flex-col shrink-0 bg-surface/30">
      <div className="p-3 border-b border-line-soft">
        <button
          onClick={onCreate}
          disabled={creating}
          className="w-full flex items-center justify-center gap-2 bg-nova hover:bg-nova-dim disabled:opacity-60 text-ink font-medium rounded-lg px-3 py-2.5 text-sm transition-colors"
        >
          <Plus size={16} />
          {creating ? "Starting…" : "New conversation"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 && (
          <div className="px-4 py-8 text-center">
            <MessageSquare size={20} className="text-faint mx-auto mb-2" />
            <p className="text-xs text-faint">No conversations yet.</p>
          </div>
        )}

        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group w-full text-left px-4 py-3 flex items-start justify-between gap-2 border-l-2 transition-colors ${
              activeId === c.id
                ? "border-nova bg-surface-2"
                : "border-transparent hover:bg-surface-2/60"
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm text-paper truncate">{c.title}</div>
              <div className="text-xs text-faint font-mono mt-0.5">
                {new Date(c.updated_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <span
              onClick={(e) => handleDeleteClick(e, c.id)}
              className={`shrink-0 p-1.5 rounded-md transition-colors ${
                pendingDeleteId === c.id
                  ? "bg-bad/20 text-bad"
                  : "text-faint opacity-0 group-hover:opacity-100 hover:text-bad hover:bg-bad/10"
              }`}
              title={pendingDeleteId === c.id ? "Click again to confirm" : "Delete conversation"}
            >
              <Trash2 size={14} />
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
