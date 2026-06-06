import React, { useState, useEffect } from 'react';
import LogEntry from './LogEntry';

const LogViewer = ({ logs = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [processedLogs, setProcessedLogs] = useState([]);

    useEffect(() => {
        const validLogs = logs
            .filter((log) => typeof log === 'string' && log.trim() !== '')
            .filter((log) => {
                const isValidLog = !log.includes('<!DOCTYPE') && !log.includes('<html>') && !log.includes('<script>');
                return isValidLog && log.toLowerCase().includes(searchTerm.toLowerCase());
            });

        setProcessedLogs(validLogs);
    }, [logs, searchTerm]);

    const parseLogLine = (logLine) => {
        const logRegex = /^(?<timestamp>\S+ \S+)?\s*\[?(?<level>[a-zA-Z]+)\]?:?\s*(?<message>.*)$/;
        const match = logLine.match(logRegex);

        return match ? {
            timestamp: match.groups.timestamp || 'Tanpa Waktu',
            level: (match.groups.level || 'info').toLowerCase(),
            message: match.groups.message,
        } : null;
    };

    return (
        <div className="modern-log-viewer" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="toolbar-card" style={{ marginBottom: 0 }}>
                <div>
                    <div className="section-heading__eyebrow">
                        <i className="bi bi-activity"></i>
                        Live API Stream
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <h6 style={{ margin: 0, color: '#f8fafc', fontSize: 18, fontWeight: 700 }}>Recent log lines</h6>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>
                            Inspect the latest application output with fast filtering and monospace readability.
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="chip-button is-active" style={{ cursor: 'default' }}>
                        <i className="bi bi-list-ul"></i>
                        {processedLogs.length} visible
                    </div>
                    <div className="chip-button" style={{ cursor: 'default' }}>
                        <i className="bi bi-database"></i>
                        {logs.length} loaded
                    </div>
                </div>
            </div>

            <div className="search-shell">
                <span className="search-shell__icon">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    placeholder="Search level, timestamp, or message"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control border-0"
                    style={{ flex: 1, minWidth: '120px', background: 'transparent', paddingLeft: 0 }}
                />
            </div>

            <div className="viewer-panel viewer-scroll" style={{ flex: 1, minHeight: 0 }}>
                <div className="log-entries" style={{ marginTop: 0, flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {processedLogs.length > 0 ? (
                        processedLogs.map((log, index) => {
                            const logObj = parseLogLine(log);
                            return logObj ? (
                                <LogEntry
                                    key={index}
                                    timestamp={logObj.timestamp}
                                    level={logObj.level}
                                    message={logObj.message}
                                />
                            ) : (
                                <div
                                    key={index}
                                    className="alert text-warning rounded shadow-sm"
                                    style={{
                                        fontSize: 'clamp(11px, 2vw, 13px)',
                                        padding: '12px 14px',
                                        marginBottom: 0,
                                        background: 'rgba(245, 158, 11, 0.12)',
                                        borderColor: 'rgba(245, 158, 11, 0.24)',
                                    }}
                                >
                                    Log tidak valid: {log}
                                </div>
                            );
                        })
                    ) : (
                        <div
                            className="alert text-info text-center rounded shadow-sm"
                            style={{
                                fontSize: 'clamp(11px, 2vw, 13px)',
                                padding: '16px 18px',
                                marginBottom: 0,
                                background: 'rgba(56, 189, 248, 0.08)',
                                borderColor: 'rgba(56, 189, 248, 0.22)',
                            }}
                        >
                            Tidak ada log untuk ditampilkan
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogViewer;
