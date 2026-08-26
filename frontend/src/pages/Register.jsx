import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import { NovaWordmark } from "../components/NovaMark";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-10 text-paper inline-block">
          <NovaWordmark size={20} />
        </Link>

        <h1 className="font-display text-2xl font-medium text-paper mb-1">
          Create your account
        </h1>
        <p className="text-sm text-muted mb-8">
          Takes about ten seconds. No card required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-faint mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-faint focus:border-nova outline-none transition-colors"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-faint mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-faint focus:border-nova outline-none transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-faint mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-paper placeholder:text-faint focus:border-nova outline-none transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <div className="text-sm text-bad bg-nova-soft/40 border border-bad/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-nova hover:bg-nova-dim disabled:opacity-60 text-ink font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
          >
            {busy ? "Creating account…" : "Create account"}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-sm text-muted mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-paper underline underline-offset-4 decoration-line hover:decoration-nova">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
