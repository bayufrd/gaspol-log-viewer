import React from 'react'

const subTabIcons = {
  client: 'bi-terminal',
  update: 'bi-arrow-repeat',
}

export default function ModernSubTabs({ tabs, active, onChange }) {
  const activeTab = tabs.find((tab) => tab.key === active) || tabs[0]

  return (
    <div className="reference-subtabs">
      <nav className="reference-subtabs__nav" aria-label="Windows log sections">
        {tabs.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`reference-subtab${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <i className={`bi ${subTabIcons[tab.key] || 'bi-circle'}`} aria-hidden="true"></i>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="reference-subtabs__content">
        {activeTab?.content}
      </div>
    </div>
  )
}
