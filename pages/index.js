import path from 'path';
import React, { useEffect } from 'react';
import { normalizeOutletSummary } from '../lib/outletSummary';
import Link from 'next/link';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';
import LogWindowsViewer from '../components/LogWindowsViewer';
import ModernSubTabs from '../components/ModernSubTabs';

function WindowsSubTabs({ summaryData, fetchLogsByOutlet, visibleFields, setVisibleFields, windowsLogsData, loading, loadingMore, hasMore, paginationSupported, loadMoreError, retryLoadMore, loadMoreLogs, outletLogs, error, autoRefreshEnabled, setAutoRefreshEnabled, lastLogsFetchAt }) {
    const [active, setActive] = React.useState('client');
    return (
        <ModernSubTabs
            tabs={[
                {
                    key: 'client',
                    label: 'Log Client Windows',
                    content: (
                        <div className="windows-logs-layout">
                            <div className="windows-page-heading">
                                <div>
                                    <span className="windows-kicker"><i className="bi bi-terminal"></i> Client diagnostics</span>
                                    <h1>Windows Client Logs</h1>
                                    <p>Grouped outlet diagnostics</p>
                                </div>
                                <span className="windows-live-status"><span></span> LIVE</span>
                            </div>
                            <p className="windows-supporting-copy">Similar logs are merged automatically so recent incidents are easier to review.</p>
                            <div className="windows-filter-panel" aria-label="Windows log filters">
                                <div className="windows-filter-row">
                                    <div className="windows-filter-group windows-outlet-group">
                                        <label htmlFor="outlet-stream">Outlet stream</label>
                                        <select id="outlet-stream" value={outletLogs || 'ALL'} onChange={(event) => fetchLogsByOutlet(event.target.value)}>
                                            <option value="ALL">All outlets</option>
                                            {summaryData.map((item) => <option key={item.outlet_id} value={item.outlet_id}>{item.outlet_name} · {item.total_logs}</option>)}
                                        </select>
                                        <span className="windows-selected-stream"><i className="bi bi-broadcast-pin"></i> {outletLogs === 'ALL' ? 'All outlets' : summaryData.find((item) => String(item.outlet_id) === String(outletLogs))?.outlet_name || `Outlet ${outletLogs}`}</span>
                                    </div>
                                    <div className="windows-filter-group windows-fields-group">
                                        <div className="windows-refresh-header">
                                            <span className="windows-filter-label">Log refresh</span>
                                            <button type="button" className="windows-refresh-button" onClick={() => fetchLogsByOutlet(outletLogs, { refresh: true })} disabled={loading}>
                                                <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
                                                {loading ? 'Loading…' : 'Refresh'}
                                            </button>
                                        </div>
                                        <div className="windows-refresh-options" role="radiogroup" aria-label="Automatic log refresh">
                                            <label className="windows-radio-option">
                                                <input type="radio" name="windows-auto-refresh" checked={!autoRefreshEnabled} onChange={() => setAutoRefreshEnabled(false)} />
                                                <span>OFF</span>
                                            </label>
                                            <label className="windows-radio-option">
                                                <input type="radio" name="windows-auto-refresh" checked={autoRefreshEnabled} onChange={() => setAutoRefreshEnabled(true)} />
                                                <span>ON · 15s</span>
                                            </label>
                                        </div>
                                        <span className="windows-refresh-status" role="status">
                                            {lastLogsFetchAt ? `Last fetched ${lastLogsFetchAt.toLocaleTimeString()}` : 'Not fetched yet'}
                                        </span>
                                        <span className="windows-filter-label">Visible fields</span>
                                        <div className="windows-field-options">
                                            {Object.keys(visibleFields).map((field) => (
                                                <label key={field} className="windows-field-option">
                                                    <input type="checkbox" checked={visibleFields[field]} onChange={() => setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }))} />
                                                    <span>{field.replace('_', ' ')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <LogWindowsViewer
                                windowsLogsData={windowsLogsData}
                                loading={loading}
                                loadingMore={loadingMore}
                                hasMore={hasMore}
                                loadMoreError={loadMoreError}
                                onLoadMore={loadMoreLogs}
                                onRetryLoadMore={retryLoadMore}
                                paginationSupported={paginationSupported}
                                visibleFields={visibleFields}
                                error={error}
                            />
                        </div>
                    )
                },
                {
                    key: 'update',
                    label: 'Log Update Confirm Client Windows',
                    content: (
                        <div style={{ width: '100%', minHeight: '30vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 16 }}>
                            <div className="toolbar-card" style={{ marginBottom: 0 }}>
                                <div>
                                    <div className="section-heading__eyebrow">
                                        <i className="bi bi-arrow-repeat"></i>
                                        Update Sync Status
                                    </div>
                                    <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>
                                        Monitor version rollout status for each Windows client outlet.
                                    </p>
                                </div>
                            </div>
                            <div style={{ flex: 1, minHeight: 0, maxHeight: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                                <LogWindowsViewer
                                    windowsLogsData={[]}
                                    loading={loading}
                                    visibleFields={visibleFields}
                                    onlyUpdateConfirm={true}
                                    style={{ flex: 1, minHeight: 0, height: '100%' }}
                                />
                            </div>
                        </div>
                    )
                }
            ]}
            active={active}
            onChange={setActive}
        />
    );
}

const Home = ({ logFiles, pm2Logs, windowsLogs }) => {
    const [currentLogs, setCurrentLogs] = React.useState([]);
    const [windowsLogsData, setWindowsLogsData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [windowsLogsError, setWindowsLogsError] = React.useState('');
    const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(false);
    const [lastLogsFetchAt, setLastLogsFetchAt] = React.useState(null);
    const logsRequestRef = React.useRef(null);
    const logsRequestIdRef = React.useRef(0);
    const logsTimerRef = React.useRef(null);
    const logsCursorRef = React.useRef(null);
    const logsHasMoreRef = React.useRef(false);
    const logsLoadingMoreRef = React.useRef(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [loadMoreError, setLoadMoreError] = React.useState('');
    const [hasMore, setHasMore] = React.useState(false);
    const [paginationSupported, setPaginationSupported] = React.useState(true);
    const [passwordInput, setPasswordInput] = React.useState('');
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const logViewerRef = React.useRef(null);
    const [summaryData, setSummaryData] = React.useState([]);
    const [outletLogs, setOutletLogs] = React.useState("ALL");
    const [activeTab, setActiveTab] = React.useState('api');
    const [complaintsData, setComplaintsData] = React.useState([]);
    const [complaintLoading, setComplaintLoading] = React.useState(false);
    const [complaintLoadingMore, setComplaintLoadingMore] = React.useState(false);
    const [complaintLoadMoreError, setComplaintLoadMoreError] = React.useState('');
    const [complaintHasMore, setComplaintHasMore] = React.useState(false);
    const [complaintTotal, setComplaintTotal] = React.useState(0);
    const [complaintFilters, setComplaintFilters] = React.useState({ search: '', excludeUntitled: false });
    const [complaintProgress, setComplaintProgress] = React.useState({ loaded: 0, total: null, done: false, error: null });
    const [complaintCardsLoaded, setComplaintCardsLoaded] = React.useState(0);
    const complaintRequestRef = React.useRef(null);
    const complaintRequestIdRef = React.useRef(0);
    const complaintCursorRef = React.useRef(null);
    const complaintHasMoreRef = React.useRef(false);
    const complaintLoadingMoreRef = React.useRef(false);
    const complaintFiltersRef = React.useRef({ search: '', excludeUntitled: false });

    // Simple custom encrypt/decrypt (XOR + base64)
    function encryptSession(str) {
        const key = 'gaspol2026';
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }
    function decryptSession(enc) {
        const key = 'gaspol2026';
        let str = atob(enc);
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    // Check session on mount
    React.useEffect(() => {
        const session = localStorage.getItem('dt_logs_gaspol_session');
        if (session) {
            try {
                const decrypted = decryptSession(session);
                const sessionObj = JSON.parse(decrypted);
                const now = new Date();
                const sessionDate = new Date(sessionObj.timestamp);
                const diffMs = now - sessionDate;
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                if (diffDays < 7) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('dt_logs_gaspol_session');
                    setIsAuthenticated(false);
                }
            } catch (e) {
                localStorage.removeItem('dt_logs_gaspol_session');
                setIsAuthenticated(false);
            }
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("selectedOutlet");
        if (saved) setOutletLogs(saved);
    }, []);


    const [visibleFields, setVisibleFields] = React.useState({
        outlet_id: true,
        message: true,
        exception: false,
        source: false,
        additional_info: false,
        log_level: true,
        created_at: true,
    });

    const fetchSummary = async () => {
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUri}/logsummary/all`);
            if (!response.ok) throw new Error("Gagal ambil summary");
            const data = await response.json();
            setSummaryData(normalizeOutletSummary(data.data));
        } catch (err) {
            console.error("Error fetch summary:", err);
        }
    };
    useEffect(() => {
        fetchSummary();
    }, []);

    // IndexedDB helpers (simple) for caching large payloads
    const idbSet = (storeName, key, value) => new Promise((resolve, reject) => {
        try {
            const open = indexedDB.open('gaspol-cache', 1);
            open.onupgradeneeded = () => {
                const db = open.result;
                if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName);
            };
            open.onsuccess = () => {
                const db = open.result;
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                store.put(value, key);
                tx.oncomplete = () => { db.close(); resolve(); };
                tx.onerror = (e) => { db.close(); reject(e); };
            };
            open.onerror = (e) => reject(e);
        } catch (e) { reject(e); }
    });

    const idbGet = (storeName, key) => new Promise((resolve, reject) => {
        try {
            const open = indexedDB.open('gaspol-cache', 1);
            open.onupgradeneeded = () => {
                const db = open.result;
                if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName);
            };
            open.onsuccess = () => {
                const db = open.result;
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.get(key);
                req.onsuccess = () => { db.close(); resolve(req.result); };
                req.onerror = (e) => { db.close(); reject(e); };
            };
            open.onerror = (e) => reject(e);
        } catch (e) { reject(e); }
    });

    // Retained for compatibility with existing callers; paginated requests use fetchPaginatedComplaints below.
    const fetchComplaints = React.useCallback(async (opts = { force: false }) => {
        // check cache first unless forced
        try {
            if (!opts.force) {
                const cachedMeta = await idbGet('complaints', 'meta');
                if (cachedMeta && cachedMeta.ts) {
                    const age = Date.now() - cachedMeta.ts;
                    if (age < 6 * 60 * 60 * 1000 && cachedMeta.sizeKey) {
                        // load cached data
                        const cached = await idbGet('complaints', 'data');
                        if (cached) {
                            setComplaintsData(cached);
                            setComplaintCardsLoaded(Array.isArray(cached) ? cached.length : 0);
                            setComplaintProgress((p) => ({ ...p, done: true, loaded: 0, total: null }));
                            return;
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Cache read error', e);
        }

        setComplaintLoading(true);
        setComplaintProgress({ loaded: 0, total: null, done: false, error: null });
        setComplaintsData([]);
        setComplaintCardsLoaded(0);

        let aborted = false;
        const controller = new AbortController();
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            // Try the request up to 3 times (network errors or non-OK responses). If server returns 304,
            // immediately fall back to cache. After attempts exhausted, try cache as fallback.
            let resp = null;
            const maxAttempts = 3;
            let attempt = 0;
            let lastErr = null;
            while (attempt < maxAttempts) {
                attempt += 1;
                try {
                    resp = await fetch(`${baseUri}/complaint`, { signal: controller.signal });
                    if (resp.status === 304) {
                        // fall back to cache
                        try {
                            const cached = await idbGet('complaints', 'data');
                            if (cached) {
                                setComplaintsData(cached);
                                setComplaintCardsLoaded(Array.isArray(cached) ? cached.length : 0);
                                setComplaintProgress((p) => ({ ...p, done: true, loaded: cached ? Math.round(JSON.stringify(cached).length) : 0, total: cached ? Math.round(JSON.stringify(cached).length) : null }));
                                setComplaintLoading(false);
                                return;
                            }
                        } catch (e) {
                            console.warn('Error reading cache after 304', e);
                        }
                        lastErr = new Error(`HTTP ${resp.status}`);
                        break; // don't retry on 304
                    }
                    if (resp.ok) break; // success
                    lastErr = new Error(`HTTP ${resp.status}`);
                } catch (err) {
                    lastErr = err;
                }

                // if not last attempt, wait with exponential backoff
                if (attempt < maxAttempts) {
                    const waitMs = 500 * Math.pow(2, attempt - 1);
                    await new Promise(r => setTimeout(r, waitMs));
                }
            }

            if (!resp || !resp.ok) {
                // attempts exhausted or non-OK -> try to use cache as fallback
                try {
                    const cached = await idbGet('complaints', 'data');
                    if (cached) {
                        setComplaintsData(cached);
                        setComplaintCardsLoaded(Array.isArray(cached) ? cached.length : 0);
                        setComplaintProgress((p) => ({ ...p, done: true, loaded: cached ? Math.round(JSON.stringify(cached).length) : 0, total: cached ? Math.round(JSON.stringify(cached).length) : null, error: lastErr ? lastErr.message : null }));
                        setComplaintLoading(false);
                        return;
                    }
                } catch (e) {
                    console.warn('Cache fallback failed', e);
                }
                throw lastErr || new Error('Failed to fetch complaints');
            }
            const total = resp.headers.get('Content-Length');
            const reader = resp.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let received = 0;
            let buffer = '';
            let inArray = false;
            let objectStarted = false;
            let braceCount = 0;
            let inString = false;
            let escape = false;
            const parsedItems = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (aborted) { controller.abort(); return; }
                received += value.length;
                setComplaintProgress((p) => ({ ...p, loaded: received, total: total ? Number(total) : null }));
                buffer += decoder.decode(value, { stream: true });

                // process buffer: find start of array
                if (!inArray) {
                    const idx = buffer.indexOf('[');
                    if (idx !== -1) {
                        inArray = true;
                        buffer = buffer.slice(idx + 1);
                    } else {
                        // keep buffer small
                        if (buffer.length > 1024 * 64) buffer = buffer.slice(-1024 * 16);
                        continue;
                    }
                }

                // parse objects from buffer
                let i = 0;
                let startIdx = -1;
                while (i < buffer.length) {
                    const ch = buffer[i];
                    if (!objectStarted) {
                        if (ch === '{') {
                            objectStarted = true;
                            braceCount = 1;
                            inString = false;
                            escape = false;
                            startIdx = i;
                        }
                        i++;
                        continue;
                    }

                    if (inString) {
                        if (escape) { escape = false; }
                        else if (ch === '\\') { escape = true; }
                        else if (ch === '"') { inString = false; }
                    } else {
                        if (ch === '"') { inString = true; }
                        else if (ch === '{') { braceCount++; }
                        else if (ch === '}') { braceCount--; }
                    }

                    if (objectStarted && braceCount === 0) {
                        const objText = buffer.slice(startIdx, i + 1);
                        // attempt parse
                        try {
                            const obj = JSON.parse(objText);
                            parsedItems.push(obj);
                            // update UI incrementally
                            setComplaintsData((prev) => {
                                const next = [...prev, obj];
                                setComplaintCardsLoaded(next.length);
                                return next;
                            });
                        } catch (e) {
                            console.warn('Partial JSON parse failed, will retry with more data');
                        }
                        // move buffer past this object and possible comma
                        buffer = buffer.slice(i + 1);
                        i = 0;
                        objectStarted = false;
                        startIdx = -1;
                        continue;
                    }
                    i++;
                }
                // keep buffer small
                if (buffer.length > 1024 * 128) buffer = buffer.slice(-1024 * 64);
            }

            // finished reading, try to parse any trailing object (if present)
            if (buffer.trim().length > 0) {
                // buffer may contain closing ]} etc. try to extract final object(s)
                let b = buffer;
                while (true) {
                    const idx = b.indexOf('{');
                    if (idx === -1) break;
                    let brace = 0;
                    let j = idx;
                    inString = false;
                    escape = false;
                    for (; j < b.length; j++) {
                        const ch = b[j];
                        if (inString) {
                            if (escape) { escape = false; }
                            else if (ch === '\\') { escape = true; }
                            else if (ch === '"') { inString = false; }
                        } else {
                            if (ch === '"') { inString = true; }
                            else if (ch === '{') brace++;
                            else if (ch === '}') brace--;
                            if (brace === 0) break;
                        }
                    }
                    if (brace === 0) {
                        const objText = b.slice(idx, j + 1);
                        try {
                            const obj = JSON.parse(objText);
                            parsedItems.push(obj);
                            setComplaintsData((prev) => {
                                const next = [...prev, obj];
                                setComplaintCardsLoaded(next.length);
                                return next;
                            });
                        } catch (e) {
                            // ignore
                        }
                        b = b.slice(j + 1);
                    } else break;
                }
            }

            // mark done
            setComplaintProgress((p) => ({ ...p, done: true }));

            // If we parsed too few items (possible parser failure on large/complex JSON),
            // attempt a full-buffer fallback once (opts.forceFull prevents loop).
            if ((parsedItems.length < 2) && !opts.forceFull) {
                console.warn('Parsed very few items during streaming; attempting full-buffer fallback');
                try {
                    // read full response again (or use resp if still available) and parse fully
                    const resp2 = await fetch(`${baseUri}/complaint`);
                    if (resp2.ok) {
                        const total2 = resp2.headers.get('Content-Length');
                        const reader2 = resp2.body.getReader();
                        const decoder2 = new TextDecoder('utf-8');
                        let received2 = 0;
                        const chunks2 = [];
                        while (true) {
                            const { done: done2, value: value2 } = await reader2.read();
                            if (done2) break;
                            chunks2.push(value2);
                            received2 += value2.length;
                            setComplaintProgress((p) => ({ ...p, loaded: received2, total: total2 ? Number(total2) : null }));
                        }
                        let full2 = new Uint8Array(received2);
                        let pos2 = 0;
                        for (const chunk of chunks2) { full2.set(chunk, pos2); pos2 += chunk.length; }
                        const text2 = decoder2.decode(full2);
                        const json2 = JSON.parse(text2);
                        const items = json2.data || [];
                        setComplaintsData(items);
                        setComplaintCardsLoaded(items.length);
                        // store to IDB
                        try {
                            await idbSet('complaints', 'data', items);
                            await idbSet('complaints', 'meta', { ts: Date.now(), sizeKey: items.length });
                        } catch (ee) { console.warn('IDB write failed on fallback', ee); }
                        setComplaintProgress((p) => ({ ...p, done: true }));
                        setComplaintLoading(false);
                        return;
                    }
                } catch (e) {
                    console.warn('Full-buffer fallback failed', e);
                }
            }

            // store parsedItems (full array) into IndexedDB if possible
            try {
                await idbSet('complaints', 'data', parsedItems);
                await idbSet('complaints', 'meta', { ts: Date.now(), sizeKey: parsedItems.length });
            } catch (e) {
                console.warn('IDB write failed', e);
            }
        } catch (err) {
            console.error('Error fetching complaints:', err);
            setComplaintProgress({ loaded: 0, total: null, done: true, error: err.message });
        } finally {
            setComplaintLoading(false);
        }
    }, []);

    const fetchPaginatedComplaints = React.useCallback(async (options = {}) => {
        const isLoadMore = Boolean(options.loadMore);
        const filters = options.filters || complaintFiltersRef.current;
        if (isLoadMore && (!complaintHasMoreRef.current || complaintLoadingMoreRef.current || !complaintCursorRef.current)) return false;

        const requestId = isLoadMore ? complaintRequestIdRef.current : ++complaintRequestIdRef.current;
        if (!isLoadMore && complaintRequestRef.current) complaintRequestRef.current.abort();
        if (!isLoadMore) {
            complaintCursorRef.current = null;
            complaintHasMoreRef.current = false;
            setComplaintHasMore(false);
            setComplaintTotal(0);
            setComplaintsData([]);
            setComplaintCardsLoaded(0);
            setComplaintLoading(true);
        } else {
            complaintLoadingMoreRef.current = true;
            setComplaintLoadingMore(true);
            setComplaintLoadMoreError('');
        }
        setComplaintProgress({ loaded: 0, total: null, done: false, error: null });
        const controller = new AbortController();
        if (!isLoadMore) complaintRequestRef.current = controller;

        try {
            const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/complaint`);
            url.searchParams.set('limit', '5');
            if (filters.search) url.searchParams.set('search', filters.search);
            if (filters.excludeUntitled) url.searchParams.set('exclude_untitled', 'true');
            if (isLoadMore) url.searchParams.set('cursor', complaintCursorRef.current);
            const response = await fetch(url.toString(), { signal: controller.signal, cache: isLoadMore ? 'default' : 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload = await response.json();
            if (requestId !== complaintRequestIdRef.current) return false;
            const page = Array.isArray(payload.data) ? payload.data : [];
            setComplaintsData((previous) => {
                if (!isLoadMore) return page;
                const byId = new Map(previous.map((item, index) => [String(item.id || `${item.name}_${index}`), item]));
                page.forEach((item, index) => byId.set(String(item.id || `${item.name}_${index}`), item));
                return Array.from(byId.values());
            });
            setComplaintCardsLoaded((previous) => isLoadMore ? previous + page.length : page.length);
            setComplaintTotal(Number(payload.pagination?.total || 0));
            complaintCursorRef.current = payload.pagination?.next_cursor || null;
            complaintHasMoreRef.current = Boolean(payload.pagination?.has_more && payload.pagination?.next_cursor);
            setComplaintHasMore(complaintHasMoreRef.current);
            setComplaintProgress({ loaded: page.length, total: page.length, done: true, error: null });
            return true;
        } catch (error) {
            if (error.name === 'AbortError') return false;
            if (requestId === complaintRequestIdRef.current) {
                if (isLoadMore) setComplaintLoadMoreError('Unable to load more complaints.');
                else setComplaintProgress({ loaded: 0, total: null, done: true, error: 'Unable to load complaints. Check the connection and try again.' });
            }
            return false;
        } finally {
            if (!isLoadMore) {
                if (complaintRequestRef.current === controller) complaintRequestRef.current = null;
                if (requestId === complaintRequestIdRef.current) setComplaintLoading(false);
            } else {
                complaintLoadingMoreRef.current = false;
                setComplaintLoadingMore(false);
            }
        }
    }, []);

    const loadMoreComplaints = React.useCallback(() => fetchPaginatedComplaints({ loadMore: true }), [fetchPaginatedComplaints]);
    const retryLoadMoreComplaints = React.useCallback(() => loadMoreComplaints(), [loadMoreComplaints]);
    const updateComplaintFilters = React.useCallback((nextFilters) => {
        const normalized = { search: String(nextFilters.search || '').trim(), excludeUntitled: Boolean(nextFilters.excludeUntitled) };
        complaintFiltersRef.current = normalized;
        setComplaintFilters(normalized);
        fetchPaginatedComplaints({ filters: normalized });
    }, [fetchPaginatedComplaints]);

    // Start with page one; filter changes intentionally reset the cursor.
    useEffect(() => {
        fetchPaginatedComplaints();
        return () => {
            if (complaintRequestRef.current) complaintRequestRef.current.abort();
        };
    }, [fetchPaginatedComplaints]);

    const fetchLogsByOutlet = React.useCallback(async (outletId, options = {}) => {
        const isRefresh = Boolean(options.refresh);
        const requestId = ++logsRequestIdRef.current;
        if (logsRequestRef.current) logsRequestRef.current.abort();
        logsCursorRef.current = null;
        logsHasMoreRef.current = false;
        setHasMore(false);
        setPaginationSupported(true);
        setLoadMoreError('');
        setLoading(true);
        setWindowsLogsError('');
        setWindowsLogsData([]);
        setOutletLogs(outletId);
        const controller = new AbortController();
        logsRequestRef.current = controller;

        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const endpoint = outletId === 'ALL' ? `${baseUri}/logs` : `${baseUri}/logs/${encodeURIComponent(outletId)}`;
            const url = new URL(endpoint);
            url.searchParams.set('limit', '5');
            const response = await fetch(url.toString(), { signal: controller.signal, cache: isRefresh ? 'no-store' : 'default' });
            if (!response.ok) throw new Error('Gagal ambil logs');
            const data = await response.json();
            if (requestId !== logsRequestIdRef.current) return false;
            setWindowsLogsData(Array.isArray(data.data) ? data.data : []);
            const hasPagination = Boolean(data.pagination && typeof data.pagination === 'object');
            setPaginationSupported(hasPagination);
            logsCursorRef.current = data.pagination?.next_cursor || null;
            logsHasMoreRef.current = hasPagination && Boolean(data.pagination?.has_more && data.pagination?.next_cursor);
            setHasMore(logsHasMoreRef.current);
            setLastLogsFetchAt(new Date());
            return true;
        } catch (err) {
            if (err.name !== 'AbortError' && requestId === logsRequestIdRef.current) {
                console.error('Error fetch outlet logs:', err);
                setWindowsLogsError('Unable to load Windows client logs. Check the connection and try again.');
            }
            return false;
        } finally {
            if (logsRequestRef.current === controller) logsRequestRef.current = null;
            if (requestId === logsRequestIdRef.current) setLoading(false);
        }
    }, []);

    const loadMoreLogs = React.useCallback(async () => {
        if (!logsHasMoreRef.current || !logsCursorRef.current || logsLoadingMoreRef.current || loading || !outletLogs) return false;
        const requestId = logsRequestIdRef.current;
        const cursor = logsCursorRef.current;
        logsLoadingMoreRef.current = true;
        setLoadingMore(true);
        setLoadMoreError('');
        const controller = new AbortController();
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const endpoint = outletLogs === 'ALL' ? `${baseUri}/logs` : `${baseUri}/logs/${encodeURIComponent(outletLogs)}`;
            const url = new URL(endpoint);
            url.searchParams.set('limit', '5');
            url.searchParams.set('cursor', cursor);
            const response = await fetch(url.toString(), { signal: controller.signal });
            if (!response.ok) throw new Error('Gagal memuat halaman berikutnya');
            const data = await response.json();
            if (requestId !== logsRequestIdRef.current) return false;
            setWindowsLogsData((previous) => {
                const byId = new Map(previous.map((log) => [String(log.id), log]));
                (data.data || []).forEach((log) => byId.set(String(log.id), log));
                return Array.from(byId.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            });
            const hasPagination = Boolean(data.pagination && typeof data.pagination === 'object');
            setPaginationSupported(hasPagination);
            logsCursorRef.current = data.pagination?.next_cursor || null;
            logsHasMoreRef.current = hasPagination && Boolean(data.pagination?.has_more && data.pagination?.next_cursor);
            setHasMore(logsHasMoreRef.current);
            return true;
        } catch (err) {
            if (err.name !== 'AbortError' && requestId === logsRequestIdRef.current) {
                setLoadMoreError('Unable to load more Windows client logs.');
            }
            return false;
        } finally {
            logsLoadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [loading, outletLogs]);

    const retryLoadMore = React.useCallback(() => loadMoreLogs(), [loadMoreLogs]);


    const fetchWindowsLogs = async () => {
        setLoading(true);
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUri}/logs`); // Ganti dengan endpoint yang sesuai
            if (!response.ok) throw new Error('File not found');
            const data = await response.json();
            setWindowsLogsData(data.data); // Mengambil data dari JSON yang dikembalikan
        } catch (error) {
            console.error('Error fetching Windows logs:', error);
            setWindowsLogsData([`Error fetching logs: ${error.message}`]);
        }
        setLoading(false);
    };

    // React.useEffect(() => {
    //     fetchWindowsLogs(outletLogs); // Memanggil fetchWindowsLogs saat komponen dimuat
    // }, []);

    useEffect(() => {
        localStorage.setItem('selectedOutlet', outletLogs);
    }, [outletLogs]);

    useEffect(() => {
        if (!isAuthenticated || !outletLogs) return undefined;
        fetchLogsByOutlet(outletLogs);
        return () => {
            if (logsTimerRef.current) {
                window.clearTimeout(logsTimerRef.current);
                logsTimerRef.current = null;
            }
            if (logsRequestRef.current) {
                logsRequestRef.current.abort();
                logsRequestRef.current = null;
            }
        };
    }, [isAuthenticated, outletLogs, fetchLogsByOutlet]);

    useEffect(() => {
        if (!isAuthenticated || !autoRefreshEnabled || !outletLogs) return undefined;

        let cancelled = false;
        const scheduleNext = () => {
            if (cancelled) return;
            logsTimerRef.current = window.setTimeout(async () => {
                logsTimerRef.current = null;
                await fetchLogsByOutlet(outletLogs, { refresh: true });
                scheduleNext();
            }, 15000);
        };

        scheduleNext();
        return () => {
            cancelled = true;
            if (logsTimerRef.current) {
                window.clearTimeout(logsTimerRef.current);
                logsTimerRef.current = null;
            }
        };
    }, [autoRefreshEnabled, fetchLogsByOutlet, isAuthenticated, outletLogs]);

    const readLogFile = async (filePath, ispm2Log = false) => {
        setLoading(true);
        try {
            const fullPath = ispm2Log ? `/pm2logs/${filePath}` : `/logs/${filePath}`;
            const response = await fetch(fullPath);
            if (!response.ok) throw new Error('File not found');
            const data = await response.text();
            const lines = data.split('\n');
            setCurrentLogs(lines.slice(-100));
        } catch (error) {
            console.error('Error reading log file:', error);
            setCurrentLogs([`Error membaca file: ${error.message}`]);
        }
        setLoading(false);
        if (logViewerRef.current) {
            logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === process.env.NEXT_PUBLIC_ACCESS_PASSWORD) {
            // Save session with encrypted timestamp
            const sessionObj = {
                timestamp: new Date().toISOString(),
                info: 'gaspol-login',
            };
            const encrypted = encryptSession(JSON.stringify(sessionObj));
            localStorage.setItem('dt_logs_gaspol_session', encrypted);
            setIsAuthenticated(true);
        } else {
            alert('Password salah!');
            setPasswordInput('');
        }
    };

    // Jika belum login, tampilkan form login
    if (!isAuthenticated) {
        return (
            <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="app-shell__container" style={{ maxWidth: 480, width: '100%' }}>
                    <form
                        onSubmit={handleLogin}
                        className="glass-panel"
                        style={{
                            padding: '32px 28px',
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 20,
                            alignItems: 'stretch',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 22,
                                    background: 'rgba(8, 47, 73, 0.62)',
                                    border: '1px solid rgba(56, 189, 248, 0.28)',
                                    boxShadow: '0 18px 40px rgba(8, 47, 73, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                <img
                                    src="/favicon.ico"
                                    alt="Logo"
                                    style={{ width: 40, height: 40, borderRadius: 12, filter: 'drop-shadow(0 2px 8px #0008)' }}
                                />
                            </div>
                            <div className="section-heading__eyebrow">
                                <i className="bi bi-shield-lock-fill"></i>
                                Protected Access
                            </div>
                            <h3 style={{ margin: '16px 0 8px', fontWeight: 700, letterSpacing: 0.4, fontSize: 28, color: '#fff' }}>
                                Gaspol Log Viewer
                            </h3>
                            <p style={{ margin: 0, color: '#94a3b8' }}>
                                Authenticate to open the redesigned monitoring workspace for API, Windows, complaints, and docs.
                            </p>
                        </div>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Masukkan password access"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            style={{ textAlign: 'center', minHeight: 52 }}
                        />
                        <button
                            className="btn w-100"
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #0891b2, #2563eb)',
                                border: 'none',
                                borderRadius: 14,
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: 0.4,
                                color: '#eff6ff',
                                minHeight: 50,
                                boxShadow: '0 14px 30px rgba(37, 99, 235, 0.28)',
                            }}
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const ModernTabs = require('../components/ModernTabs').default;
    return (
        <div className="app-shell app-shell--reference">
            <div className="app-shell__container app-shell__container--fluid">
                    <ModernTabs
                        tabs={[
                            {
                                key: 'api',
                                label: 'API Logs',
                                content: (
                                    <section className="reference-page-section">
                                        <div className="reference-page-hero">
                                            <div>
                                                <span className="section-heading__eyebrow"><i className="bi bi-server"></i> API Regular Logs</span>
                                                <h1>API Logs Monitoring</h1>
                                                <p>Browse backend log files and inspect the latest lines in the redesigned live viewer.</p>
                                            </div>
                                            <span className="windows-live-status"><span></span> LIVE</span>
                                        </div>
                                        <div className="reference-source-panel">
                                            <span className="filter-panel__label">Active log files</span>
                                            <div className="chip-row chip-row--scroll">
                                            {logFiles.map((fileName) => (
                                                <LogFileButton
                                                    key={fileName}
                                                    fileName={fileName}
                                                    onClick={() => readLogFile(fileName, false)}
                                                />
                                            ))}
                                            </div>
                                        </div>
                                        <div ref={logViewerRef}>
                                            <LogViewer logs={currentLogs} />
                                        </div>
                                    </section>
                                )
                            },
                            {
                                key: 'pm2',
                                label: 'PM2 Logs',
                                content: (
                                    <section className="reference-page-section">
                                        <div className="reference-page-hero">
                                            <div>
                                                <span className="section-heading__eyebrow"><i className="bi bi-cpu-fill"></i> PM2 Process Logs</span>
                                                <h1>PM2 Runtime Logs</h1>
                                                <p>Open PM2 log outputs with the same searchable high-contrast viewer experience.</p>
                                            </div>
                                            <span className="windows-live-status"><span></span> LIVE</span>
                                        </div>
                                        <div className="reference-source-panel">
                                            <span className="filter-panel__label">Active process files</span>
                                            <div className="chip-row chip-row--scroll">
                                            {pm2Logs.map((fileName) => (
                                                <LogFileButton
                                                    key={fileName}
                                                    fileName={fileName}
                                                    onClick={() => readLogFile(fileName, true)}
                                                />
                                            ))}
                                            </div>
                                        </div>
                                        <div ref={logViewerRef}>
                                            <LogViewer logs={currentLogs} />
                                        </div>
                                    </section>
                                )
                            },
                            {
                                key: 'windows',
                                label: 'Windows Logs',
                                content: (
                                    <section className="reference-page-section" style={{ minHeight: 400 }}>
                                        <WindowsSubTabs
                                            summaryData={summaryData}
                                            fetchLogsByOutlet={fetchLogsByOutlet}
                                            visibleFields={visibleFields}
                                            setVisibleFields={setVisibleFields}
                                            windowsLogsData={windowsLogsData}
                                            loading={loading}
                                            outletLogs={outletLogs}
                                            error={windowsLogsError}
                                            paginationSupported={paginationSupported}
                                            autoRefreshEnabled={autoRefreshEnabled}
                                            setAutoRefreshEnabled={setAutoRefreshEnabled}
                                            lastLogsFetchAt={lastLogsFetchAt}
                                            loadingMore={loadingMore}
                                            hasMore={hasMore}
                                            loadMoreError={loadMoreError}
                                            loadMoreLogs={loadMoreLogs}
                                            retryLoadMore={retryLoadMore}
                                        />
                                    </section>
                                )
                            },
                            {
                                key: 'complaints',
                                label: 'Complaint Report',
                                content: (
                                    <section className="reference-page-section reference-page-section--flush">
                                        <React.Suspense fallback={<div className="p-3">Loading complaint UI...</div>}>
                                            {typeof window !== 'undefined' && (() => {
                                                const C = require('../components/ComplaintReport').default;
                                                return (
                                                    <C
                                                        complaints={complaintsData}
                                                        loading={complaintLoading}
                                                        onRefetch={() => fetchPaginatedComplaints()}
                                                        progress={complaintProgress}
                                                        cardsLoaded={complaintCardsLoaded}
                                                        filters={complaintFilters}
                                                        onFiltersChange={updateComplaintFilters}
                                                        onLoadMore={loadMoreComplaints}
                                                        onRetryLoadMore={retryLoadMoreComplaints}
                                                        loadingMore={complaintLoadingMore}
                                                        loadMoreError={complaintLoadMoreError}
                                                        hasMore={complaintHasMore}
                                                        total={complaintTotal}
                                                        pageSize={5}
                                                    />
                                                );
                                            })()}
                                        </React.Suspense>
                                    </section>
                                )
                            },
                            {
                                key: 'docs',
                                label: 'API Docs',
                                content: (
                                    <section className="reference-page-section" style={{ minHeight: '70vh' }}>
                                        <div className="toolbar-card" style={{ marginBottom: 0 }}>
                                            <div>
                                                <div className="section-heading__eyebrow">
                                                    <i className="bi bi-code-square"></i>
                                                    API Documentation
                                                </div>
                                                <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>
                                                    Integrated Swagger reference framed with the new desktop and mobile shell direction.
                                                </p>
                                            </div>
                                            <Link href="/apiDocs" className="btn btn-outline-light">
                                                Open standalone docs
                                            </Link>
                                        </div>
                                        <div className="surface-card" style={{ padding: 16, borderRadius: 24, minHeight: '60vh' }}>
                                            <iframe
                                                src={process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:3001/api-docs'}
                                                style={{ width: '100%', height: '100%', minHeight: '58vh', border: 'none', borderRadius: 16, background: '#ffffff', overflow: 'auto' }}
                                                title="API Documentation"
                                                scrolling="yes"
                                            />
                                        </div>
                                    </section>
                                )
                            }
                        ]}
                        active={activeTab}
                        onChange={setActiveTab}
                    />

            </div>
        </div>
    );
};

export async function getStaticProps() {
    const fs = require('fs'); // Mengimpor fs di dalam fungsi ini
    const path = require('path'); // Mengimpor path di dalam fungsi ini
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs');
    const pm2LogsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'pm2logs');
    const windowsLogsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'windowsLogs'); // Path untuk log client Windows

    // Buat direktori jika tidak ada
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory, { recursive: true });
    }

    if (!fs.existsSync(pm2LogsDirectory)) {
        fs.mkdirSync(pm2LogsDirectory, { recursive: true });
    }

    if (!fs.existsSync(windowsLogsDirectory)) {
        fs.mkdirSync(windowsLogsDirectory, { recursive: true });
    }

    try {
        const logFiles = fs.readdirSync(logsDirectory);
        const pm2LogFiles = fs.readdirSync(pm2LogsDirectory);
        const windowsLogFiles = fs.readdirSync(windowsLogsDirectory); // Ambil logs client Windows jika diperlukan

        // Cek ada atau tidaknya log client Windows
        const windowsLogs = windowsLogFiles.length > 0 ? await fs.promises.readFile(path.join(windowsLogsDirectory, windowsLogFiles[0]), 'utf-8') : '{}';

        return {
            props: {
                logFiles: logFiles,
                pm2Logs: pm2LogFiles,
                // Mengembalikan log client windows yang sudah diparsing
                windowsLogs: JSON.parse(windowsLogs).data || [],
            },
            revalidate: 10 // Opsional: untuk ISR (Incremental Static Regeneration)
        };
    } catch (error) {
        console.error("Error reading logs folder:", error);
        return {
            props: {
                logFiles: [],
                pm2Logs: [],
                windowsLogs: [],
            },
        };
    }
}


export default Home;