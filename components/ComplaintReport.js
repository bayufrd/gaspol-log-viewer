import React, { useState } from 'react';

const smallJsonStyle = {
    background: 'rgba(2, 6, 23, 0.72)',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: 16,
    padding: 12,
    maxHeight: 180,
    overflow: 'auto',
    fontFamily: 'GeistMono, Courier New, monospace',
    fontSize: 12,
    color: '#cbd5e1',
};

function parseName(name = '') {
    const parts = name.split('_');
    if (parts.length < 3) return { outletId: '', outletName: name, version: '', reportedBy: '' };
    const outletId = parts[0] || '';
    const reportedBy = parts[parts.length - 1] || '';
    const version = parts[parts.length - 2] || '';
    const outletNameParts = parts.slice(2, parts.length - 2);
    const outletName = outletNameParts.join(' ').replace(/\s+/g, ' ').trim();
    return { outletId, outletName, version, reportedBy };
}

const CopyButton = ({ text, label = 'Copy' }) => {
    const handle = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };
    return (
        <button className="btn btn-outline-light btn-sm" onClick={handle}>
            {label}
        </button>
    );
};

const JsonPanel = ({ title, data }) => {
    const text = (() => {
        try {
            return typeof data === 'string' ? data : JSON.stringify(data || {}, null, 2);
        } catch (e) {
            return String(data);
        }
    })();

    return (
        <div style={{ marginTop: 12 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.04em' }}>{title}</div>
                <CopyButton text={text} label="Copy JSON" />
            </div>
            <div style={smallJsonStyle} className="complaint-json viewer-scroll">
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{text}</pre>
            </div>
        </div>
    );
};

const MetaBadge = ({ children, tone = 'default' }) => {
    const tones = {
        default: {
            color: '#dbeafe',
            border: 'rgba(148, 163, 184, 0.16)',
            background: 'rgba(15, 23, 42, 0.72)',
        },
        accent: {
            color: '#7dd3fc',
            border: 'rgba(56, 189, 248, 0.22)',
            background: 'rgba(8, 47, 73, 0.48)',
        },
    };
    const style = tones[tone] || tones.default;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 10px',
                borderRadius: 999,
                fontSize: 11,
                color: style.color,
                border: `1px solid ${style.border}`,
                background: style.background,
            }}
        >
            {children}
        </span>
    );
};

const ComplaintReport = ({
    complaints = [],
    loading,
    loadingMore = false,
    loadMoreError = '',
    hasMore = false,
    total = 0,
    pageSize = 40,
    filters = { search: '', excludeUntitled: false },
    onFiltersChange,
    onLoadMore,
    onRetryLoadMore,
    onRefetch,
    progress,
    cardsLoaded,
}) => {
    const [expandedMap, setExpandedMap] = useState({});
    const [hideUntitled, setHideUntitled] = useState(Boolean(filters.excludeUntitled));
    const [search, setSearch] = useState(filters.search || '');
    const [showCount, setShowCount] = useState(0);

    const toggleExpanded = (key) => {
        setExpandedMap((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // The server applies the active filters; retain this guard for compatibility with older callers.
    const filtered = (complaints || []).filter((c) => {
        if (!hideUntitled) return true;
        const displayName = (c.name || c.title || '').toString().trim();
        return displayName && displayName.toLowerCase() !== 'untitled';
    });

    React.useEffect(() => {
        let mounted = true;
        const total = filtered.length;
        if (total === 0) {
            setShowCount(0);
            return;
        }
        if (showCount >= total) return;
        const step = 5;
        const interval = 120;
        if (showCount === 0) setShowCount(Math.min(total, step));
        let timeoutId;
        const revealNext = () => {
            if (!mounted) return;
            setShowCount((prev) => {
                if (prev >= total) return prev;
                timeoutId = setTimeout(revealNext, interval);
                return Math.min(total, prev + step);
            });
        };
        timeoutId = setTimeout(revealNext, interval);
        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtered.length]);

    return (
        <div style={{ width: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
            <div className="toolbar-card" style={{ marginBottom: 0 }}>
                <div>
                    <div className="section-heading__eyebrow">
                        <i className="bi bi-bug-fill"></i>
                        Complaint Timeline
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <h5 style={{ margin: 0, color: '#f8fafc' }}>Complaint incidents</h5>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>
                            Review incoming reports, metadata, and cached payload snapshots in a structured dark layout.
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {typeof cardsLoaded === 'number' && (
                        <div className="chip-button is-active" style={{ cursor: 'default' }}>
                            <i className="bi bi-collection"></i>
                            {cardsLoaded} cards
                        </div>
                    )}
                    {progress && progress.total && (
                        <div className="chip-button" style={{ cursor: 'default' }}>
                            <i className="bi bi-hdd-network"></i>
                            {Math.round((progress.loaded || 0) / 1024)} KB
                        </div>
                    )}
                    <input
                        className="form-control form-control-sm"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && onFiltersChange) {
                                onFiltersChange({ search, excludeUntitled: hideUntitled });
                            }
                        }}
                        placeholder="Search complaints"
                        style={{ width: 180 }}
                    />
                    <button className="btn btn-outline-light btn-sm" onClick={() => {
                        const next = !hideUntitled;
                        setHideUntitled(next);
                        onFiltersChange && onFiltersChange({ search, excludeUntitled: next });
                    }}>
                        {hideUntitled ? 'Show all' : 'Hide untitled'}
                    </button>
                    <button className="btn btn-outline-light btn-sm" onClick={() => onRefetch && onRefetch()}>
                        Fetch again
                    </button>
                </div>
            </div>

            {loading && (
                <div
                    className="alert text-info text-center rounded shadow-sm"
                    style={{
                        fontSize: 13,
                        padding: 14,
                        marginBottom: 0,
                        background: 'rgba(56, 189, 248, 0.08)',
                        borderColor: 'rgba(56, 189, 248, 0.22)',
                    }}
                >
                    Fetching complaint data in background...
                </div>
            )}

            {!loading && !progress?.error && filtered.length === 0 && (
                <div
                    className="alert text-info text-center rounded shadow-sm"
                    style={{
                        fontSize: 13,
                        padding: 14,
                        marginBottom: 0,
                        background: 'rgba(56, 189, 248, 0.08)',
                        borderColor: 'rgba(56, 189, 248, 0.22)',
                    }}
                >
                    No complaint data available
                </div>
            )}

            {progress?.error && !loading && (
                <div className="alert alert-danger text-center" style={{ marginBottom: 0 }}>
                    {progress.error}
                    <button className="btn btn-sm btn-outline-light ms-2" onClick={() => onRefetch && onRefetch()}>Retry</button>
                </div>
            )}

            <div className="viewer-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
                <div style={{ display: 'grid', gap: 14 }}>
                    {filtered.slice(0, showCount).map((c, i) => {
                        const key = c.id || c.name || `${i}`;
                        const expanded = !!expandedMap[key];
                        const { outletId, outletName, version, reportedBy } = parseName(c.name || '');
                        return (
                            <div
                                key={`${key}_${i}`}
                                className="surface-card"
                                style={{
                                    borderRadius: 22,
                                    padding: 18,
                                    border: '1px solid rgba(148, 163, 184, 0.14)',
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-3" style={{ gap: 12, flexWrap: 'wrap' }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontFamily: 'GeistMono, Courier New, monospace', fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                                            {c.name || c.title}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8, whiteSpace: 'pre-line' }}>
                                            {c.message || 'No message'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>
                                        <div>{c.sent_at || ''}</div>
                                    </div>
                                </div>

                                <div className="d-flex" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                    {outletId && <MetaBadge tone="accent">Outlet ID: {outletId}</MetaBadge>}
                                    {outletName && <MetaBadge>Outlet: {outletName}</MetaBadge>}
                                    {version && <MetaBadge>Version: {version}</MetaBadge>}
                                    {reportedBy && <MetaBadge>Reported by: {reportedBy}</MetaBadge>}
                                    <div style={{ marginLeft: 'auto' }}>
                                        <button className="btn btn-outline-light btn-sm" onClick={() => toggleExpanded(key)}>
                                            {expanded ? 'Hide details' : 'Expand details'}
                                        </button>
                                    </div>
                                </div>

                                {expanded && (
                                    <div style={{ marginTop: 16 }}>
                                        <JsonPanel title="log_last_outlet" data={c.log_last_outlet || {}} />
                                        <JsonPanel title="cache_transaction" data={c.cache_transaction || {}} />
                                        <JsonPanel title="cache_failed_transaction" data={c.cache_failed_transaction || {}} />
                                        <JsonPanel title="cache_success_transaction" data={c.cache_success_transaction || {}} />
                                        <JsonPanel title="cache_history_transaction" data={c.cache_history_transaction || {}} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {filtered.length > 0 && (
                <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: 10 }}>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>
                        Showing {filtered.length} of {total || filtered.length} complaints (page size {pageSize})
                    </span>
                    {loadingMore && <span className="text-info" style={{ fontSize: 12 }}>Loading more complaints...</span>}
                    {!loadingMore && loadMoreError && (
                        <span className="text-danger" style={{ fontSize: 12 }}>
                            {loadMoreError}
                            <button className="btn btn-outline-light btn-sm ms-2" onClick={() => onRetryLoadMore && onRetryLoadMore()}>Retry</button>
                        </span>
                    )}
                    {!loadingMore && !loadMoreError && hasMore && (
                        <button className="btn btn-outline-light btn-sm" onClick={() => onLoadMore && onLoadMore()}>Load more</button>
                    )}
                    {!loadingMore && !loadMoreError && !hasMore && <span style={{ color: '#64748b', fontSize: 12 }}>No more complaints</span>}
                </div>
            )}
        </div>
    );
};

export default ComplaintReport;
