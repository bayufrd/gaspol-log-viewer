import React from 'react'

export default function ModernSubTabs({ tabs, active, onChange }) {
  return (
    <div
      style={{
        width: '100%',
        background: 'transparent',
        marginBottom: 16,
        overflowX: 'auto',
        padding: 0,
      }}
    >
      <div
        className="modern-subtabs-bar"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: 8,
          minWidth: 120,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          width: '100%',
          borderRadius: 18,
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
              className={isActive ? 'modern-subtab-active' : 'modern-subtab'}
              style={{
                background: isActive ? 'rgba(8, 47, 73, 0.82)' : 'rgba(15, 23, 42, 0.92)',
                color: isActive ? '#f8fafc' : '#cbd5e1',
                border: '1px solid',
                borderColor: isActive ? 'rgba(56, 189, 248, 0.32)' : 'transparent',
                borderRadius: 14,
                padding: '10px 14px',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                minWidth: 150,
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 8px 22px rgba(8, 47, 73, 0.24)' : 'none',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div style={{ padding: 0, marginTop: 12, width: '100%' }}>
        {tabs.find((tab) => tab.key === active)?.content}
      </div>
      <style jsx>{`
        .modern-subtab:hover {
          color: #e2e8f0;
          background: rgba(15, 23, 42, 0.98);
          border-color: rgba(56, 189, 248, 0.18);
        }
        .modern-subtab:focus {
          outline: 2px solid rgba(56, 189, 248, 0.42);
          outline-offset: 2px;
        }
        .modern-subtab-active {
          box-shadow: 0 8px 20px rgba(8, 47, 73, 0.24);
        }
        @media (max-width: 600px) {
          .modern-subtabs-bar {
            justify-content: flex-start !important;
            padding-left: 6px;
            padding-right: 6px;
          }
        }
      `}</style>
    </div>
  )
}
