import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface PendingUser {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  status: ApprovalStatus;
  createdAt: string;
}

type Decision = Extract<ApprovalStatus, "approved" | "rejected">;

interface Banner {
  tone: "success" | "error";
  message: string;
}

/* ---------------------------------- utils --------------------------------- */

function displayName(user: PendingUser) {
  const joined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return user.fullName?.trim() || joined || user.email.split("@")[0];
}

function initials(name: string) {
  const parts = name.replace(/[^\p{L}\s]/gu, " ").trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function waitedFor(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "just now";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"}`;
  const months = Math.round(days / 30);
  return `${months} mo`;
}

/** The list can arrive as an array, or nested under data / data.users / users. */
function normalizeList(payload: unknown): PendingUser[] {
  if (Array.isArray(payload)) return payload as PendingUser[];
  const body = payload as Record<string, unknown> | null;
  if (!body) return [];
  const data = body.data as Record<string, unknown> | unknown[] | undefined;
  if (Array.isArray(data)) return data as PendingUser[];
  if (data && Array.isArray((data as Record<string, unknown>).users)) {
    return (data as Record<string, unknown>).users as PendingUser[];
  }
  if (Array.isArray(body.users)) return body.users as PendingUser[];
  return [];
}

function readError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Your session has expired. Sign in again to continue.";
    }
    return (error.response?.data as { message?: string })?.message || error.message || fallback;
  }
  return fallback;
}

/* --------------------------------- icons ---------------------------------- */

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Spinner = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 animate-spin" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" />
    <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

/* -------------------------------- component ------------------------------- */

export default function PendingUsers() {
  const [token] = useState<string | undefined>(Cookies.get("authToken"));

  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [query, setQuery] = useState("");

  /** userId -> decision currently in flight, so each row locks independently. */
  const [inFlight, setInFlight] = useState<Record<string, Decision>>({});
  const [confirming, setConfirming] = useState<PendingUser | null>(null);

  const fetchPendingUsers = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEVE_URL}/user/all-users?status=pending`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const list = normalizeList(response.data)
          .filter((user) => user.status === "pending")
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setUsers(list);
      } catch (error) {
        setLoadError(readError(error, "Couldn't load the approval queue."));
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    void fetchPendingUsers();
  }, [fetchPendingUsers]);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(timer);
  }, [banner]);

  async function decide(user: PendingUser, status: Decision) {
    setInFlight((prev) => ({ ...prev, [user._id]: status }));
    setBanner(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}/user/${user._id}/approval`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsers((prev) => prev.filter((item) => item._id !== user._id));
      setBanner({
        tone: "success",
        message:
          status === "approved"
            ? `${displayName(user)} can now sign in.`
            : `${displayName(user)}'s request was rejected.`,
      });
    } catch (error) {
      setBanner({ tone: "error", message: readError(error, "That decision didn't go through. Try again.") });
    } finally {
      setInFlight((prev) => {
        const next = { ...prev };
        delete next[user._id];
        return next;
      });
    }
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(
      (user) =>
        displayName(user).toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        (user.role ?? "").toLowerCase().includes(needle),
    );
  }, [users, query]);

  const oldest = users[0];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Approval queue</h1>
            <p className="mt-1 max-w-prose text-sm text-slate-600">
              {loading
                ? "Checking who's waiting…"
                : users.length === 0
                  ? "Nobody is waiting for access."
                  : `${users.length} ${users.length === 1 ? "person is" : "people are"} waiting for access${
                      oldest ? `. Longest wait: ${waitedFor(oldest.createdAt)}.` : "."
                    }`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchPendingUsers({ silent: true })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
            disabled={loading}
          >
            Refresh list
          </button>
        </header>

        {/* Feedback */}
        {banner ? (
          <div
            role="status"
            className={`mt-6 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              banner.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <span className="flex-1">{banner.message}</span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="rounded text-current/70 hover:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
              aria-label="Dismiss message"
            >
              <CrossIcon />
            </button>
          </div>
        ) : null}

        {/* Search */}
        {users.length > 3 ? (
          <div className="mt-6">
            <label htmlFor="queue-search" className="sr-only">
              Search the queue
            </label>
            <input
              id="queue-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, or role"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:max-w-sm"
            />
          </div>
        ) : null}

        {/* Body */}
        <div className="mt-6">
          {loading ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((key) => (
                <li key={key} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-40 rounded bg-slate-200" />
                      <div className="h-3 w-56 rounded bg-slate-100" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : loadError ? (
            <div className="rounded-xl border border-rose-200 bg-white p-8 text-center">
              <p className="text-sm font-medium text-rose-700">{loadError}</p>
              <button
                type="button"
                onClick={() => void fetchPendingUsers()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                {query ? "No one in the queue matches that search." : "The queue is clear."}
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                {query
                  ? "Clear the search to see everyone still waiting."
                  : "New sign-ups land here as soon as they register, and stay until you approve or reject them."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {visible.map((user) => {
                const pendingDecision = inFlight[user._id];
                const busy = Boolean(pendingDecision);
                const name = displayName(user);

                return (
                  <li
                    key={user._id}
                    className={`rounded-xl border border-slate-200 border-l-4 border-l-amber-400 bg-white p-5 transition-opacity ${
                      busy ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700"
                      >
                        {initials(name)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">{name}</p>
                        <p className="truncate text-sm text-slate-600">{user.email}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {user.role ? `${user.role} · ` : ""}
                          {user.phone ? `${user.phone} · ` : ""}
                          waiting {waitedFor(user.createdAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirming(user)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {pendingDecision === "rejected" ? <Spinner /> : <CrossIcon />}
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() => void decide(user, "approved")}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {pendingDecision === "approved" ? <Spinner /> : <CheckIcon />}
                          Approve
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Reject confirmation */}
      {confirming ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirming(null);
          }}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 id="reject-title" className="text-base font-semibold text-slate-900">
              Reject {displayName(confirming)}?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              They won't be able to sign in, and they'll leave the queue. You can still find them in the full user list.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
              >
                Keep waiting
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = confirming;
                  setConfirming(null);
                  void decide(target, "rejected");
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Reject request
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}