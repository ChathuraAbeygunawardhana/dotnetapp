'use client';

import { useCallback, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

type HelloData  = { message: string } | null;
type HealthData = { status: string }  | null;
type FetchState = 'idle' | 'loading' | 'success' | 'error';

function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data,  setData]  = useState<T | null>(null);
  const [state, setState] = useState<FetchState>('idle');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const run = useCallback(async () => {
    setState('loading');
    const t0 = performance.now();
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const ms  = Math.round(performance.now() - t0);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setLatencyMs(ms);
      setState('success');
    } catch {
      setState('error');
      setLatencyMs(null);
    }
  }, [url]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run(); }, deps);

  return { data, state, latencyMs, refresh: run };
}

/* ── Small components ── */

function StatusBadge({ state, label }: { state: FetchState; label: string }) {
  if (state === 'loading')
    return (
      <span className="badge badge-loading">
        <span className="pulse-dot loading" />
        checking
      </span>
    );
  if (state === 'error')
    return (
      <span className="badge badge-error">
        <span className="pulse-dot error" />
        unreachable
      </span>
    );
  return (
    <span className="badge badge-ok">
      <span className="pulse-dot ok" />
      {label}
    </span>
  );
}

function Latency({ ms }: { ms: number | null }) {
  if (ms === null) return null;
  return (
    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
      <span className="mono">{ms} ms</span>
    </span>
  );
}

function RefreshBtn({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button className="btn" onClick={onClick} disabled={loading} id="refresh-all-btn">
      {loading ? <span className="spinner" /> : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      )}
      Refresh
    </button>
  );
}

/* ── Main page ── */

export default function DashboardPage() {
  const hello  = useFetch<HelloData>(`${API_BASE}/`,       []);
  const health = useFetch<HealthData>(`${API_BASE}/health`, []);

  const refreshAll = () => {
    hello.refresh();
    health.refresh();
  };

  const isLoading = hello.state === 'loading' || health.state === 'loading';
  const lastUpdated = new Date().toLocaleTimeString();

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        gap: '2.5rem',
      }}
    >
      {/* ── Header ── */}
      <header
        className="fade-in"
        style={{ textAlign: 'center', maxWidth: '560px' }}
      >
        {/* Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '999px',
            background: 'rgba(79,141,255,0.08)',
            border: '1px solid rgba(79,141,255,0.20)',
            marginBottom: '1.25rem',
            fontSize: '0.78rem',
            color: 'var(--accent-blue)',
            fontWeight: 500,
            letterSpacing: '0.04em',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }} />
          ASP.NET Core · Vercel Container Runtime
        </div>

        <h1
          className="gradient-text"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '0.75rem' }}
        >
          HelloWorld Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Live status and responses from your .NET API running on Vercel Functions.
        </p>
      </header>

      {/* ── Cards grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.25rem',
          width: '100%',
          maxWidth: '780px',
        }}
      >
        {/* Greeting card */}
        <article
          id="greeting-card"
          className="glass-card fade-in stagger-1"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(79,141,255,0.25), rgba(0,212,255,0.15))',
                  border: '1px solid rgba(79,141,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Endpoint</div>
                <div className="mono" style={{ fontSize: '0.85rem' }}>GET /</div>
              </div>
            </div>
            <StatusBadge state={hello.state} label="reachable" />
          </div>

          <div className="divider" style={{ marginBottom: '1.25rem' }} />

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response</div>
            {hello.state === 'loading' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
                <span className="spinner" /> Fetching…
              </div>
            )}
            {hello.state === 'error' && (
              <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>Failed to reach API</p>
            )}
            {hello.state === 'success' && hello.data && (
              <p
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}
              >
                {(hello.data as { message: string }).message}
              </p>
            )}
          </div>

          {hello.latencyMs !== null && (
            <div style={{ marginTop: '1rem' }}>
              <Latency ms={hello.latencyMs} />
            </div>
          )}
        </article>

        {/* Health card */}
        <article
          id="health-card"
          className="glass-card fade-in stagger-2"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.20), rgba(0,212,255,0.10))',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Endpoint</div>
                <div className="mono" style={{ fontSize: '0.85rem' }}>GET /health</div>
              </div>
            </div>
            <StatusBadge
              state={health.state}
              label={(health.data as { status: string } | null)?.status ?? 'ok'}
            />
          </div>

          <div className="divider" style={{ marginBottom: '1.25rem' }} />

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
            {health.state === 'loading' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
                <span className="spinner" /> Checking…
              </div>
            )}
            {health.state === 'error' && (
              <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>Health check failed</p>
            )}
            {health.state === 'success' && health.data && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="pulse-dot ok" />
                <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>
                  {(health.data as { status: string }).status}
                </span>
              </div>
            )}
          </div>

          {health.latencyMs !== null && (
            <div style={{ marginTop: '1rem' }}>
              <Latency ms={health.latencyMs} />
            </div>
          )}
        </article>
      </div>

      {/* ── Footer toolbar ── */}
      <footer
        className="fade-in stagger-3"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <RefreshBtn loading={isLoading} onClick={refreshAll} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Last updated <span className="mono">{lastUpdated}</span>
        </span>
      </footer>
    </main>
  );
}
