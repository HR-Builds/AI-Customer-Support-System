import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Ticket, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NovaWordmark } from "./NovaMark";

export function AppShellHeader({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="h-14 border-b border-line-soft flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-6">
        <Link to="/dashboard">
          <NovaWordmark size={17} />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
              active === "dashboard" ? "bg-surface-2 text-paper" : "text-faint hover:text-muted"
            }`}
          >
            Console
          </Link>
          <Link
            to="/tickets"
            className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
              active === "tickets" ? "bg-surface-2 text-paper" : "text-faint hover:text-muted"
            }`}
          >
            <Ticket size={13} /> Tickets
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                active === "admin" ? "bg-surface-2 text-paper" : "text-faint hover:text-muted"
              }`}
            >
              <ShieldCheck size={13} /> Admin
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm text-paper leading-tight">{user?.name}</div>
          <div className="text-xs text-faint leading-tight">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-faint hover:text-bad transition-colors p-2 rounded-md hover:bg-surface"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
