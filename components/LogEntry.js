import React from 'react';

const LogEntry = ({ timestamp, level, message }) => {
    const levelColors = {
        error: {
            label: 'ERROR',
            color: '#fca5a5',
            border: 'rgba(239, 68, 68, 0.28)',
            glow: 'rgba(239, 68, 68, 0.14)',
            icon: 'bi-exclamation-octagon-fill',
        },
        warn: {
            label: 'WARN',
            color: '#fcd34d',
            border: 'rgba(245, 158, 11, 0.28)',
            glow: 'rgba(245, 158, 11, 0.14)',
            icon: 'bi-exclamation-triangle-fill',
        },
        info: {
            label: 'INFO',
            color: '#7dd3fc',
            border: 'rgba(56, 189, 248, 0.28)',
            glow: 'rgba(56, 189, 248, 0.14)',
            icon: 'bi-info-circle-fill',
        },
        debug: {
            label: 'DEBUG',
            color: '#c4b5fd',
            border: 'rgba(168, 85, 247, 0.26)',
            glow: 'rgba(168, 85, 247, 0.14)',
            icon: 'bi-terminal-fill',
        },
    };

    const tone = levelColors[level] || levelColors.debug;

    return (
        <div
            className="log-entry"
            style={{
                border: `1px solid ${tone.border}`,
                borderRadius: 18,
                fontSize: 13,
                background: `linear-gradient(180deg, rgba(15, 23, 42, 0.96), ${tone.glow})`,
                boxShadow: '0 12px 28px rgba(2, 6, 23, 0.26)',
                overflow: 'hidden',
            }}
        >
            <div
                className="d-flex justify-content-between align-items-center"
                style={{
                    padding: '14px 16px 10px',
                    gap: 12,
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    fontFamily: 'GeistMono, Courier New, Courier, monospace',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            background: 'rgba(2, 6, 23, 0.4)',
                            color: tone.color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <i className={`bi ${tone.icon}`}></i>
                    </span>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em' }}>
                            {tone.label}
                        </div>
                        <small style={{ color: '#94a3b8' }}>{timestamp}</small>
                    </div>
                </div>
                <span
                    style={{
                        fontSize: 10,
                        lineHeight: 1,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: tone.color,
                        padding: '8px 10px',
                        borderRadius: 999,
                        border: `1px solid ${tone.border}`,
                        background: 'rgba(2, 6, 23, 0.35)',
                        flexShrink: 0,
                    }}
                >
                    {level}
                </span>
            </div>
            <div
                className="log-message"
                style={{
                    padding: '14px 16px 16px',
                    fontFamily: 'GeistMono, Courier New, Courier, monospace',
                    whiteSpace: 'pre-line',
                    color: '#dbeafe',
                    lineHeight: 1.65,
                    wordBreak: 'break-word',
                }}
            >
                {message}
            </div>
        </div>
    );
};

export default LogEntry;
