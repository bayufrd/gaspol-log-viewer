const swaggerUrl = process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:3001/api-docs';

export default function ApiDocs() {
  return (
    <div className="app-shell">
      <div className="app-shell__container">
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="section-heading" style={{ marginBottom: 20 }}>
            <div>
              <div className="section-heading__eyebrow">
                <i className="bi bi-code-square"></i>
                API Reference
              </div>
              <h1 className="section-heading__title" style={{ marginTop: 14 }}>
                Gaspol Management Center Docs
              </h1>
              <p className="section-heading__description">
                Embedded Swagger documentation inside the redesigned dark shell for desktop and mobile review.
              </p>
            </div>
            <a
              href={swaggerUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-light"
            >
              Open Full Swagger
            </a>
          </div>

          <div className="metric-grid" style={{ marginBottom: 20 }}>
            <div className="metric-card">
              <div className="metric-card__label">Mode</div>
              <div className="metric-card__value" style={{ fontSize: 20 }}>Embedded</div>
              <div className="metric-card__subtext">Dark viewer shell</div>
            </div>
            <div className="metric-card">
              <div className="metric-card__label">Source</div>
              <div className="metric-card__value" style={{ fontSize: 20 }}>Swagger</div>
              <div className="metric-card__subtext">Remote API schema</div>
            </div>
            <div className="metric-card">
              <div className="metric-card__label">Layout</div>
              <div className="metric-card__value" style={{ fontSize: 20 }}>Responsive</div>
              <div className="metric-card__subtext">Reference aligned</div>
            </div>
            <div className="metric-card">
              <div className="metric-card__label">Route</div>
              <div className="metric-card__value" style={{ fontSize: 20 }}>/apiDocs</div>
              <div className="metric-card__subtext">Standalone page</div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: 18, borderRadius: 24 }}>
            <iframe
              src={swaggerUrl}
              width="100%"
              height="900"
              style={{
                border: 'none',
                borderRadius: 18,
                background: '#ffffff',
                minHeight: '70vh',
              }}
              title="Gaspol API Documentation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
