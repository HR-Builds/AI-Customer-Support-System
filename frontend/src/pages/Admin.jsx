import { useEffect, useState } from "react";
import {
  Users,
  MessagesSquare,
  Ticket,
  Activity,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { AppShellHeader } from "../components/AppShellHeader";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [expandedConvos, setExpandedConvos] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, u] = await Promise.all([api.adminStats(), api.adminListUsers()]);
        setStats(s);
        setUsers(u);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function toggleExpand(userId) {
    if (expandedId === userId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(userId);
    try {
      const convos = await api.adminUserConversations(userId);
      setExpandedConvos(convos);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActive(u) {
    try {
      const updated = await api.adminUpdateUser(u.id, { is_active: !u.is_active });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...updated } : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleRole(u) {
    const newRole = u.role === "admin" ? "customer" : "admin";
    try {
      const updated = await api.adminUpdateUser(u.id, { role: newRole });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...updated } : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(u) {
    if (pendingDeleteId !== u.id) {
      setPendingDeleteId(u.id);
      setTimeout(() => setPendingDeleteId((cur) => (cur === u.id ? null : cur)), 2500);
      return;
    }
    try {
      await api.adminDeleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-ink">
      <AppShellHeader active="admin" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-nova" />
            <h1 className="font-display text-2xl font-semibold text-paper">Admin console</h1>
          </div>
          <p className="text-sm text-muted mb-8">
            Every account and conversation on the platform, in one place.
          </p>

          {error && (
            <div className="mb-6 text-sm text-bad bg-nova-soft/40 border border-bad/30 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {loading ? (
            <div className="font-mono text-xs text-muted tracking-widest">LOADING…</div>
          ) : (
            <>
              <StatsRow stats={stats} />

              <div className="mt-8 border border-line rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-line text-left">
                      <Th>User</Th>
                      <Th>Role</Th>
                      <Th>Status</Th>
                      <Th>Conversations</Th>
                      <Th>Tickets</Th>
                      <Th>Joined</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <UserRow
                        key={u.id}
                        u={u}
                        isSelf={u.id === currentUser.id}
                        expanded={expandedId === u.id}
                        conversations={expandedId === u.id ? expandedConvos : []}
                        onToggleExpand={() => toggleExpand(u.id)}
                        onToggleActive={() => toggleActive(u)}
                        onToggleRole={() => toggleRole(u)}
                        onDelete={() => handleDelete(u)}
                        pendingDelete={pendingDeleteId === u.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  const items = [
    { icon: Users, label: "Total users", value: stats.total_users, sub: `${stats.active_users} active` },
    { icon: MessagesSquare, label: "Conversations", value: stats.total_conversations, sub: `${stats.total_messages} messages` },
    { icon: Ticket, label: "Tickets", value: stats.total_tickets, sub: `${stats.open_tickets} open` },
    { icon: Activity, label: "Active rate", value: stats.total_users ? `${Math.round((stats.active_users / stats.total_users) * 100)}%` : "—", sub: "of all accounts" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="border border-line rounded-xl p-4 bg-surface/60">
          <Icon size={16} className="text-nova mb-3" />
          <div className="font-display text-2xl font-semibold text-paper">{value}</div>
          <div className="text-xs text-faint mt-0.5">{label} · {sub}</div>
        </div>
      ))}
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-xs font-mono uppercase tracking-wider text-faint font-medium ${className}`}>
      {children}
    </th>
  );
}

function UserRow({
  u,
  isSelf,
  expanded,
  conversations,
  onToggleExpand,
  onToggleActive,
  onToggleRole,
  onDelete,
  pendingDelete,
}) {
  return (
    <>
      <tr className="border-b border-line-soft last:border-0 hover:bg-surface-2/40 transition-colors">
        <td className="px-4 py-3">
          <button onClick={onToggleExpand} className="flex items-center gap-2 text-left group">
            {expanded ? (
              <ChevronUp size={14} className="text-faint shrink-0" />
            ) : (
              <ChevronDown size={14} className="text-faint shrink-0" />
            )}
            <div>
              <div className="text-paper group-hover:text-nova transition-colors">{u.name}</div>
              <div className="text-xs text-faint font-mono">{u.email}</div>
            </div>
          </button>
        </td>
        <td className="px-4 py-3">
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              u.role === "admin"
                ? "bg-nova-soft text-nova border border-nova-dim/30"
                : "bg-surface-2 text-muted"
            }`}
          >
            {u.role}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              u.is_active ? "text-good bg-good/10" : "text-faint bg-surface-2"
            }`}
          >
            {u.is_active ? "active" : "suspended"}
          </span>
        </td>
        <td className="px-4 py-3 text-paper-dim font-mono text-xs">{u.conversation_count}</td>
        <td className="px-4 py-3 text-paper-dim font-mono text-xs">{u.ticket_count}</td>
        <td className="px-4 py-3 text-faint font-mono text-xs">
          {new Date(u.created_at).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={onToggleRole}
              title={u.role === "admin" ? "Revoke admin" : "Make admin"}
              className="p-1.5 rounded-md text-faint hover:text-nova hover:bg-nova-soft/40 transition-colors"
            >
              <ShieldCheck size={14} />
            </button>
            <button
              onClick={onToggleActive}
              disabled={isSelf}
              title={u.is_active ? "Suspend account" : "Reactivate account"}
              className="p-1.5 rounded-md text-faint hover:text-warn hover:bg-warn/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {u.is_active ? <Ban size={14} /> : <CheckCircle2 size={14} />}
            </button>
            <button
              onClick={onDelete}
              disabled={isSelf}
              title={pendingDelete ? "Click again to confirm" : "Delete account"}
              className={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                pendingDelete ? "text-bad bg-bad/10" : "text-faint hover:text-bad hover:bg-bad/10"
              }`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-surface/40 border-b border-line-soft">
          <td colSpan={7} className="px-8 py-3">
            {conversations.length === 0 ? (
              <p className="text-xs text-faint">No conversations yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {conversations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-xs">
                    <span className="text-paper-dim">{c.title}</span>
                    <span className="text-faint font-mono">
                      {new Date(c.updated_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
