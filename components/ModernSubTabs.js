// ModernSubTabs.js
import React from 'react'

export default function ModernSubTabs({ tabs, active, onChange }) {
  return (
    <div style={{
      width: '100%',
      background: 'transparent',
      marginBottom: 16,
      overflowX: 'auto',
      padding: 0,
    }}>
      <div
        className="modern-subtabs-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          padding: '0 0 2px 0',
          minWidth: 120,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          width: '100%',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={active === tab.key ? 'modern-subtab-active' : 'modern-subtab'}
            style={{
              background: active === tab.key ? '#23272e' : 'transparent',
              color: active === tab.key ? '#fff' : '#bdbdbd',
              border: 'none',
              borderBottom: active === tab.key ? '2px solid #38bdf8' : '2px solid transparent',
              borderRadius: 5,
              padding: '4px 10px',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              minWidth: 60,
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: 200,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{padding: 0, marginTop: 4, width: '100%'}}>
        {tabs.find(tab => tab.key === active)?.content}
      </div>
      <style jsx>{`
        .modern-subtab:focus {
          outline: 2px solid #38bdf8;
        }
        .modern-subtab-active {
          box-shadow: 0 1px 4px rgba(56,189,248,0.08);
        }
        @media (max-width: 600px) {
          .modern-subtabs-bar {
            justify-content: flex-start !important;
            padding-left: 2px;
            padding-right: 2px;
          }
        }
      `}</style>
    </div>
  )
}
