const swaggerUrl = process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:3001/api-docs';

const endpointGroups = [
  {
    title: 'Logs Engine',
    icon: 'bi-terminal',
    links: [
      ['GET', 'summary/all', '#summary'],
      ['POST', 'ingest', '#post-logs'],
      ['GET', 'stream', '#swagger-frame'],
    ],
  },
  {
    title: 'Complaint Service',
    icon: 'bi-exclamation-diamond',
    links: [
      ['GET', 'complaint', '#swagger-frame'],
      ['POST', 'webhook', '#swagger-frame'],
    ],
  },
  {
    title: 'System',
    icon: 'bi-shield-check',
    links: [
      ['GET', 'health', '#swagger-frame'],
      ['PUT', 'config', '#swagger-frame'],
    ],
  },
];

function MethodBadge({ method }) {
  return <span className={`api-docs-method api-docs-method--${method.toLowerCase()}`}>{method}</span>;
}

export default function ApiDocs() {
  return (
    <div className="api-docs-shell">
      <header className="reference-topbar api-docs-topbar" aria-label="API documentation navigation">
        <div className="reference-brand">
          <span className="reference-brand__mark">G</span>
          <span className="reference-brand__text">Gaspol Log Viewer</span>
        </div>
        <nav className="reference-topnav" aria-label="Documentation sections">
          <a className="reference-nav-item" href="/">API Logs</a>
          <a className="reference-nav-item" href="/">PM2 Logs</a>
          <a className="reference-nav-item" href="/">Windows Logs</a>
          <a className="reference-nav-item" href="/">Complaints</a>
          <a className="reference-nav-item is-active" href="/apiDocs" aria-current="page">API Docs</a>
        </nav>
        <div className="reference-topbar__meta" aria-label="Documentation status">
          <span className="reference-version">v0.1.0-stable</span>
          <span className="reference-status-dot" aria-hidden="true"></span>
        </div>
      </header>

      <aside className="api-docs-sidebar" aria-label="API endpoints">
        <div className="reference-sidebar__heading">
          <span>API Documentation</span>
          <strong>v0.1.0-stable</strong>
        </div>
        {endpointGroups.map((group) => (
          <div className="api-docs-sidebar__group" key={group.title}>
            <div className="api-docs-sidebar__title">
              <i className={`bi ${group.icon}`} aria-hidden="true"></i>
              <span>{group.title}</span>
            </div>
            {group.links.map(([method, label, href]) => (
              <a className="api-docs-sidebar__link" href={href} key={`${method}-${label}`}>
                <MethodBadge method={method} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        ))}
      </aside>

      <main className="api-docs-main">
        <header className="api-docs-hero">
          <div>
            <div className="api-docs-hero__meta">
              <span className="api-docs-release">STABLE RELEASE</span>
              <span>Last update: live schema</span>
            </div>
            <h1>Gaspol API Reference</h1>
            <p>
              Technical documentation for Gaspol Log Viewer APIs, embedded in the same dark monitoring shell used across the log workspaces.
            </p>
          </div>
          <a href={swaggerUrl} target="_blank" rel="noreferrer" className="btn btn-outline-light api-docs-open">
            Open Full Swagger
          </a>
        </header>

        <section className="api-docs-card" id="summary">
          <div className="api-docs-card__header">
            <div>
              <MethodBadge method="GET" />
              <span className="api-docs-endpoint">/logsummary/all</span>
            </div>
            <span className="api-docs-pill">Try it out</span>
          </div>
          <div className="api-docs-card__body">
            <div>
              <h2>Log summary</h2>
              <p>Returns grouped outlet and Windows log summary data used by the dashboard filters.</p>
              <table className="api-docs-table">
                <tbody>
                  <tr><th>Auth</th><td>Environment backend policy</td></tr>
                  <tr><th>Response</th><td>JSON summary payload</td></tr>
                  <tr><th>Used by</th><td>Windows Logs tab</td></tr>
                </tbody>
              </table>
            </div>
            <pre className="api-docs-code">{`{
  "success": true,
  "data": [
    { "outlet": "ALL", "total": 128 }
  ]
}`}</pre>
          </div>
        </section>

        <section className="api-docs-card" id="post-logs">
          <div className="api-docs-card__header">
            <div>
              <MethodBadge method="POST" />
              <span className="api-docs-endpoint">/logs</span>
            </div>
            <span className="api-docs-pill api-docs-pill--green">Live ingest</span>
          </div>
          <div className="api-docs-card__body">
            <div>
              <h2>Log ingestion</h2>
              <p>Receives log payloads from distributed services while the UI keeps the existing polling and viewer behavior.</p>
            </div>
            <pre className="api-docs-code api-docs-code--green">{`curl -X POST \\
  "$NEXT_PUBLIC_API_URL/logs" \\
  -H "Content-Type: application/json" \\
  -d '{ "level": "info", "message": "service ready" }'`}</pre>
          </div>
        </section>

        <section className="api-docs-frame-card" id="swagger-frame">
          <div className="api-docs-frame-card__header">
            <div>
              <span className="section-heading__eyebrow"><i className="bi bi-code-square"></i> Swagger Explorer</span>
              <h2>Interactive schema</h2>
            </div>
            <a href={swaggerUrl} target="_blank" rel="noreferrer" className="btn btn-outline-light">Open Source</a>
          </div>
          <iframe
            src={swaggerUrl}
            title="Gaspol API Documentation"
            loading="lazy"
          />
        </section>
      </main>

      <footer className="reference-footer api-docs-footer" aria-label="Documentation footer">
        <span>System Status: Operational</span>
        <span>API Docs: Swagger embedded</span>
      </footer>
    </div>
  );
}
