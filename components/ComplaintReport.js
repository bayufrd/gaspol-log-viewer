import React, { useState } from 'react';

const smallJsonStyle = {
    background: '#0b0f13',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 6,
    padding: 8,
    maxHeight: 140,
    overflow: 'auto',
    fontFamily: 'GeistMono, Courier New, monospace',
    fontSize: 12,
    color: '#cbd5e1',
};

function parseName(name = '') {
    // Expected pattern: outletId_timestamp_outletName_version_reportedBy
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
            // small visual feedback
            // we avoid alerts to keep UI clean
        } catch (err) {
            console.error('Copy failed', err);
        }
    };
    return (
        <button className="btn btn-outline-light btn-sm" onClick={handle} style={{fontSize: 11, padding: '2px 8px'}}>
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
        <div style={{marginTop: 8}}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div style={{fontSize: 12, fontWeight: 600}}>{title}</div>
                <CopyButton text={text} label="Copy" />
            </div>
            <div style={smallJsonStyle}>
                <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>{text}</pre>
            </div>
        </div>
    );
};

const Badge = ({ children }) => (
    <span className="badge bg-secondary me-1" style={{fontSize: 11}}>{children}</span>
);

const ComplaintReport = ({ complaints = [], loading, onRefetch, progress, cardsLoaded }) => {
    const [expandedMap, setExpandedMap] = useState({});
    const [hideUntitled, setHideUntitled] = useState(false);
    const [showCount, setShowCount] = useState(0); // number of cards currently rendered for batching

    const toggleExpanded = (key) => {
        setExpandedMap(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // allow optionally hiding untitled, but default to showing all to avoid missing cards
    const filtered = (complaints || []).filter((c) => {
        if (!hideUntitled) return true;
        const displayName = (c.name || c.title || '').toString().trim();
        if (!displayName) return false;
        if (displayName.toLowerCase() === 'untitled') return false;
        return true;
    });

    // progressive batching: when complaints length increases, ramp up showCount to avoid UI freezing
    React.useEffect(() => {
        let mounted = true;
        const total = filtered.length;
        if (total === 0) { setShowCount(0); return; }
        // if all already shown, do nothing
        if (showCount >= total) return;
        // increase in steps
        const step = 5; // number of cards to add per tick
        const interval = 120; // ms
        const tick = () => {
            setShowCount(prev => {
                const next = Math.min(total, prev + step);
                return next;
            });
        };
        // initialize if zero
        if (showCount === 0) setShowCount(Math.min(total, step));
        const id = setInterval(() => {
            if (!mounted) return;
            setShowCount(prev => {
                if (prev >= total) { clearInterval(id); return prev; }
                return Math.min(total, prev + step);
            });
        }, interval);
        return () => { mounted = false; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtered.length]);

    return (
        <div className="p-3" style={{width: '100%', minHeight: 400, display: 'flex', flexDirection: 'column'}}>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 style={{margin: 0}}>Complaint Report</h5>
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    {typeof cardsLoaded === 'number' && (
                        <span className="badge bg-dark text-light" style={{fontSize: 12}}>{cardsLoaded} cards</span>
                    )}
                    {progress && progress.total && (
                        <span className="badge bg-dark text-light" style={{fontSize: 12}}>{Math.round((progress.loaded || 0)/1024)} KB</span>
                    )}
                    <button className="btn btn-sm btn-outline-light" onClick={() => onRefetch && onRefetch()}>
                        Fetch again
                    </button>
                </div>
            </div>
            {loading && (
                <div className="alert alert-info bg-dark text-info text-center rounded shadow-sm" style={{fontSize: 13, padding: 8}}>
                    Fetching complaint data in background...
                </div>
            )}

            {!loading && complaints.length === 0 && (
                <div className="alert alert-info bg-dark text-info text-center rounded shadow-sm" style={{fontSize: 13, padding: 8}}>
                    No complaint data available
                </div>
            )}

            <div style={{flex: 1, minHeight: 0, overflowY: 'auto'}}>
                {filtered.slice(0, showCount).map((c, i) => {
                    const key = c.name || `${i}`;
                    const expanded = !!expandedMap[key];
                    const { outletId, outletName, version, reportedBy } = parseName(c.name || '');
                    return (
                        <div key={`${key}_${i}`} className="p-2 mb-3 rounded shadow-sm bg-dark" style={{border: '1px solid #111'}}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div style={{fontFamily: 'GeistMono, Courier New, monospace', fontSize: 13, fontWeight: 700}}>{c.name || c.title}</div>
                                    <div style={{fontSize: 13, color: '#cbd5e1'}}>{c.message}</div>
                                </div>
                                <div style={{textAlign: 'right', fontSize: 12}}>
                                    <div className="text-white-300">{c.sent_at || ''}</div>
                                </div>
                            </div>

                            <div className="mb-2" style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
                                <div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
                                    {outletId && <Badge>Outlet ID: {outletId}</Badge>}
                                    {outletName && <Badge>Outlet: {outletName}</Badge>}
                                    {version && <Badge>Version: {version}</Badge>}
                                    {reportedBy && <Badge>Reported by: {reportedBy}</Badge>}
                                </div>
                                <div style={{marginLeft: 'auto'}}>
                                    <button className="btn btn-sm btn-outline-light me-2" onClick={() => toggleExpanded(key)}>
                                        {expanded ? 'Hide' : 'Expand'}
                                    </button>
                                </div>
                            </div>

                            {/* JSON panels (hidden by default) */}
                            {expanded && (
                                <>
                                    <JsonPanel title="log_last_outlet" data={c.log_last_outlet || {}} />
                                    <JsonPanel title="cache_transaction" data={c.cache_transaction || {}} />
                                    <JsonPanel title="cache_failed_transaction" data={c.cache_failed_transaction || {}} />
                                    <JsonPanel title="cache_success_transaction" data={c.cache_success_transaction || {}} />
                                    <JsonPanel title="cache_history_transaction" data={c.cache_history_transaction || {}} />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComplaintReport;
