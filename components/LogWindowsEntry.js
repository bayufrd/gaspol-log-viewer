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
        <article className="windows-log-entry" style={{ '--log-tone': tone.color, '--log-border': tone.border }}>
            <div className="windows-log-entry__header">
                <div className="windows-log-entry__identity">
                    <span className="windows-log-entry__icon"><i className={`bi ${tone.icon}`}></i></span>
                    <div className="windows-log-entry__identity-copy">
                        <div className="windows-log-entry__badges">
                            {visibleFields?.log_level && (
                                <span className="windows-level-badge">
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
                        <div className="windows-log-entry__outlet">{outletName || `Outlet ${outlet_id || '-'}`}</div>
                        {visibleFields?.outlet_id && <div className="windows-log-entry__outlet-id">ID {outlet_id || '-'}</div>}
                        {visibleFields?.created_at && <div className="windows-log-entry__timestamp"><i className="bi bi-clock"></i> {timestamp}</div>}
                    </div>
                </div>

                <div className="windows-log-entry__actions">
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

            <div className="windows-log-entry__body">
                {visibleFields?.message && <p className="windows-log-entry__message">{message || '-'}</p>}
                <div className="windows-log-entry__metadata">
                    {visibleFields?.exception && exception && <span><b>Exception</b> {exception}</span>}
                    {visibleFields?.source && source && <span><b>Source</b> {source}</span>}
                    {visibleFields?.additional_info && additionalInfo && <span><b>Additional info</b> {additionalInfo}</span>}
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
        </article>
    );
};

export default LogWindowsEntry;
