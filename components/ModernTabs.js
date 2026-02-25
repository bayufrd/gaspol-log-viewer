// ModernTabs.js
import { Tabs } from '@geist-ui/react'
import React from 'react'

export default function ModernTabs({ tabs, active, onChange }) {
  return (
    <div style={{
      width: '100%',
      background: '#18181b',
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      marginBottom: 24,
      overflowX: 'auto',
      padding: 0,
    }}>
      <div
        className="modern-tabs-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          padding: '4px 4px 0 4px',
          minWidth: 200,
          overflowX: 'auto',
          flexWrap: 'nowrap',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={active === tab.key ? 'modern-tab-active' : 'modern-tab'}
            style={{
              background: active === tab.key ? '#27272a' : 'transparent',
              color: active === tab.key ? '#fff' : '#e0e0e0',
              border: 'none',
              borderBottom: active === tab.key ? '2px solid #38bdf8' : '2px solid transparent',
              borderRadius: 6,
              padding: '6px 12px',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              minWidth: 80,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{padding: 0, marginTop: 8}}>
        {tabs.find(tab => tab.key === active)?.content}
      </div>
      <style jsx>{`
        .modern-tab:focus {
          outline: 2px solid #38bdf8;
        }
        .modern-tab-active {
          box-shadow: 0 2px 8px rgba(56,189,248,0.08);
        }
        @media (max-width: 600px) {
          .modern-tabs-bar {
            justify-content: flex-start !important;
            padding-left: 4px;
            padding-right: 4px;
          }
        }
      `}</style>
    </div>
  )
}
