// LogWindowsEntry.js
import React, { useState } from 'react';

const LogWindowsEntry = ({
    timestamp,
    outlet_id,
    outletName,
    level,
    message,
    logCode,
    exception,
    source,
    additionalInfo,
    visibleFields,
    mergedCount = 1,
    mergedItems = [],
}) => {
    const [expanded, setExpanded] = useState(false);

    const levelColors = {
        error: {
            color: '#fca5a5',
            border: 'rgba(239, 68, 68, 0.26)',
            glow: 'rgba(239, 68, 68, 0.12)',
            icon: 'bi-x-octagon-fill',
        },
        warn: {
            color: '#fcd34d',
            border: 'rgba(245, 158, 11, 0.26)',
            glow: 'rgba(245, 158, 11, 0.12)',
            icon: 'bi-exclamation-diamond-fill',
        },
        info: {
            color: '#86efac',
            border: 'rgba(34, 197, 94, 0.24)',
            glow: 'rgba(34, 197, 94, 0.12)',
            icon: 'bi-check-circle-fill',
        },
        debug: {
            color: '#7dd3fc',
            border: 'rgba(56, 189, 248, 0.24)',
            glow: 'rgba(56, 189, 248, 0.12)',
            icon: 'bi-terminal-fill',
        },
    };

    const tone = levelColors[level] || levelColors.debug;

    const handleCopy = async () => {
        const logText = [
            visibleFields?.log_level ? `${String(level || '').toUpperCase()} [${logCode || '-'}]` : null,
            visibleFields?.outlet_id ? `Outlet ID: ${outlet_id} (${outletName || '-'})` : null,
            visibleFields?.message ? `Message: ${message || '-'}` : null,
            visibleFields?.exception ? `Exception: ${exception || '-'}` : null,
            visibleFields?.source ? `Source: ${source || '-'}` : null,
            visibleFields?.additional_info ? `Additional Info: ${additionalInfo || '-'}` : null,
        ].filter(Boolean).join('\n');

        try {
            await navigator.clipboard.writeText(logText);
        } catch (err) {
            console.error('Error copying log entry:', err);
        }
    };

    return (
        <div
            className="log-entry"
            style={{
                border: `1px solid ${tone.border}`,
                borderRadius: 20,
                fontSize: 13,
                background: '#0f172a',
                boxShadow: '0 12px 28px rgba(2, 6, 23, 0.24)',
                overflow: 'hidden',
            }}
        >
            <div
                className="d-flex justify-content-between align-items-start"
                style={{
                    padding: '16px 16px 12px',
                    gap: 12,
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                }}
            >
                <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                    <span
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 14,
                            background: 'rgba(2, 6, 23, 0.38)',
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
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                            {visibleFields?.log_level && (
                                <span
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: tone.color,
                                        padding: '7px 10px',
                                        borderRadius: 999,
                                        border: `1px solid ${tone.border}`,
                                        background: 'rgba(2, 6, 23, 0.35)',
                                    }}
                                >
                                    {String(level || 'info').toUpperCase()}
                                </span>
                            )}
                            {logCode && (
                                <span className="chip-button" style={{ cursor: 'default', padding: '7px 10px' }}>
                                    #{logCode}
                                </span>
                            )}
                            {mergedCount > 1 && (
                                <span className="chip-button is-active" style={{ cursor: 'default', padding: '7px 10px' }}>
                                    {mergedCount} merged
                                </span>
                            )}
                        </div>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>
                            Outlet {outlet_id || '-'}{outletName ? ` · ${outletName}` : ''}
                        </div>
                        {visibleFields?.created_at && (
                            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4, fontFamily: 'GeistMono, Courier New, monospace' }}>
                                {timestamp}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {mergedCount > 1 && (
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setExpanded((v) => !v)}
                            aria-label={expanded ? 'Hide merged items' : 'Show merged items'}
                        >
                            {expanded ? 'Hide merged logs' : 'Show merged logs'}
                        </button>
                    )}
                    <button className="btn btn-outline-light btn-sm" onClick={handleCopy}>
                        Copy
                    </button>
                </div>
            </div>

            <div style={{ padding: '14px 16px 16px' }}>
                <div
                    className="log-message"
                    style={{
                        fontFamily: 'GeistMono, Courier New, Courier, monospace',
                        whiteSpace: 'pre-line',
                        color: '#dbeafe',
                        lineHeight: 1.7,
                        wordBreak: 'break-word',
                    }}
                >
                    {visibleFields?.message && `Message: ${message || '-'}\n`}
                    {visibleFields?.exception && exception ? `Exception: ${exception}\n` : ''}
                    {visibleFields?.source && source ? `Source: ${source}\n` : ''}
                    {visibleFields?.additional_info && additionalInfo ? `Additional Info: ${additionalInfo}\n` : ''}
                </div>

                {expanded && mergedItems && mergedItems.length > 1 && (
                    <div
                        className="viewer-scroll"
                        style={{
                            marginTop: 16,
                            borderRadius: 16,
                            border: '1px solid rgba(148, 163, 184, 0.14)',
                            background: 'rgba(2, 6, 23, 0.34)',
                            padding: 12,
                            maxHeight: 220,
                            overflowY: 'auto',
                        }}
                    >
                        {mergedItems.map((it, i) => (
                            <div
                                key={`${it.id || i}_${i}`}
                                style={{
                                    padding: '10px 0',
                                    borderBottom: i === mergedItems.length - 1 ? 'none' : '1px dashed rgba(148, 163, 184, 0.14)',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                                    <div style={{ fontFamily: 'GeistMono, Courier New, monospace', color: '#cbd5e1', fontSize: 12 }}>
                                        {visibleFields?.created_at ? new Date(it.created_at).toLocaleString() : ''}
                                    </div>
                                    {visibleFields?.source && it.source ? (
                                        <div style={{ color: '#7dd3fc', fontSize: 12 }}>
                                            {it.source}
                                        </div>
                                    ) : null}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6, whiteSpace: 'pre-line' }}>
                                    {it.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogWindowsEntry;
