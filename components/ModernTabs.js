import React from 'react'

const tabIcons = {
  api: 'bi-terminal',
  pm2: 'bi-cpu',
  windows: 'bi-pc-display-horizontal',
  complaints: 'bi-exclamation-diamond',
  docs: 'bi-menu-button-wide',
}

export default function ModernTabs({ tabs, active, onChange }) {
  const activeTab = tabs.find((tab) => tab.key === active) || tabs[0]

  return (
    <div className="reference-workspace">
      <header className="reference-topbar" aria-label="Primary navigation">
        <div className="reference-brand">
          <span className="reference-brand__mark">G</span>
          <span className="reference-brand__text">Gaspol Log Viewer</span>
        </div>
        <nav className="reference-topnav" aria-label="Application sections">
          {tabs.map((tab) => {
            const isActive = active === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className={`reference-nav-item${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <i className={`bi ${tabIcons[tab.key] || 'bi-circle'}`} aria-hidden="true"></i>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="reference-topbar__meta" aria-label="Application status">
          <span className="reference-version">v0.1.0</span>
          <span className="reference-status-dot" aria-hidden="true"></span>
        </div>
      </header>

      <div className="reference-body">
        <aside className="reference-sidebar" aria-label="Drill-down views">
          <div className="reference-sidebar__heading">
            <span>Navigation</span>
            <strong>Drill-down views</strong>
          </div>
          <div className="reference-sidebar__links">
            {tabs.map((tab) => {
              const isActive = active === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onChange(tab.key)}
                  className={`reference-sidebar-link${isActive ? ' is-active' : ''}`}
                >
                  <i className={`bi ${tabIcons[tab.key] || 'bi-circle'}`} aria-hidden="true"></i>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
          <div className="reference-operator-card">
            <span>SO</span>
            <div>
              <strong>System Operator</strong>
              <small>Admin Access</small>
            </div>
          </div>
        </aside>

        <main className="reference-main" tabIndex={-1}>
          <div className="reference-content" key={activeTab?.key}>
            {activeTab?.content}
          </div>
        </main>
      </div>

      <nav className="reference-bottom-nav" aria-label="Mobile sections">
        {tabs.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`reference-bottom-nav__item${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <i className={`bi ${tabIcons[tab.key] || 'bi-circle'}`} aria-hidden="true"></i>
              <span>{tab.label.replace(' Report', '').replace(' Logs', '')}</span>
            </button>
          )
        })}
      </nav>

      <footer className="reference-footer" aria-label="System footer">
        <span>System Status: Operational</span>
        <span>Last update: live stream</span>
      </footer>
    </div>
  )
}
