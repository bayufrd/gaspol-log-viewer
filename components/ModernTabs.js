import React from 'react'

export default function ModernTabs({ tabs, active, onChange }) {
  return (
    <div
      className="surface-card surface-card--glow"
      style={{
        width: '100%',
        padding: 18,
        borderRadius: 28,
        marginBottom: 24,
        overflow: 'hidden',
      }}
    >
      <div
        className="modern-tabs-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 8,
          minWidth: 200,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          borderRadius: 20,
          background: '#0b1220',
          border: '1px solid rgba(56, 189, 248, 0.16)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={isActive ? 'modern-tab-active' : 'modern-tab'}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(8, 47, 73, 0.95), rgba(14, 116, 144, 0.9))' : 'rgba(15, 23, 42, 0.92)',
                color: isActive ? '#f8fafc' : '#cbd5e1',
                border: '1px solid',
                borderColor: isActive ? 'rgba(56, 189, 248, 0.35)' : 'transparent',
                borderRadius: 16,
                padding: '12px 16px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                minWidth: 120,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.02em',
                boxShadow: isActive ? '0 10px 30px rgba(8, 47, 73, 0.35)' : 'none',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div style={{ padding: 0, marginTop: 16 }}>
        {tabs.find((tab) => tab.key === active)?.content}
      </div>
      <style jsx>{`
        .modern-tab:hover {
          color: #e2e8f0;
          background: rgba(15, 23, 42, 0.98);
          border-color: rgba(56, 189, 248, 0.18);
        }
        .modern-tab:focus {
          outline: 2px solid rgba(56, 189, 248, 0.45);
          outline-offset: 2px;
        }
        .modern-tab-active {
          box-shadow: 0 12px 28px rgba(8, 47, 73, 0.34);
        }
        @media (max-width: 768px) {
          .modern-tabs-bar {
            padding: 6px;
            gap: 8px;
          }
        }
        @media (max-width: 600px) {
          .modern-tabs-bar {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  )
}
