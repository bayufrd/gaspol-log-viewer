import path from 'path';
import React, { useEffect } from 'react';
import Link from 'next/link';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';
import LogWindowsViewer from '../components/LogWindowsViewer';
import ModernSubTabs from '../components/ModernSubTabs';

function WindowsSubTabs({ summaryData, fetchLogsByOutlet, visibleFields, setVisibleFields, windowsLogsData, loading }) {
    const [active, setActive] = React.useState('client');
    return (
        <ModernSubTabs
            tabs={[
                {
                    key: 'client',
                    label: 'Log Client Windows',
                    content: (
                        <div style={{
                            width: '100%',
                            height: 'calc(90vh - 80px)',
                            minHeight: '30vh',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}>
                            <h5 className="mb-2 text-center" style={{fontSize: 18}}>Log Client Windows</h5>
                            <div className="d-flex flex-wrap gap-2 mb-2" style={{fontSize: 13}}>
                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={() => fetchLogsByOutlet("ALL")}
                                >
                                    All Outlet
                                </button>
                                {summaryData.map((item) => (
                                    <button
                                        key={item.outlet_id}
                                        className="btn btn-outline-light btn-sm"
                                        onClick={() => fetchLogsByOutlet(item.outlet_id)}
                                    >
                                        {item.outlet_name} ({item.total_logs})
                                    </button>
                                ))}
                            </div>
                            <div className="mb-1 d-flex flex-wrap gap-2" style={{fontSize: 13}}>
                                {Object.keys(visibleFields).map((field) => (
                                    <label key={field} className="text-light me-2">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields[field]}
                                            onChange={() =>
                                                setVisibleFields((prev) => ({
                                                    ...prev,
                                                    [field]: !prev[field],
                                                }))
                                            }
                                        />{' '}
                                        {field.replace('_', ' ')}
                                    </label>
                                ))}
                            </div>
                            <div style={{flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
                                <LogWindowsViewer
                                    windowsLogsData={windowsLogsData}
                                    loading={loading}
                                    visibleFields={visibleFields}
                                    style={{flex: 1, minHeight: 0, height: '100%'}}
                                />
                            </div>
                        </div>
                    )
                },
                {
                    key: 'update',
                    label: 'Log Update Confirm Client Windows',
                    content: (
                        <div style={{
                            width: '100%',
                            height: 'calc(90vh - 80px)',
                            minHeight: '30vh',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}>
                            <h5 className="mb-3 text-center">Log Update Confirm Client Windows</h5>
                            <div style={{flex: 1, minHeight: 0, maxHeight: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
                                <LogWindowsViewer
                                    windowsLogsData={[]}
                                    loading={loading}
                                    visibleFields={visibleFields}
                                    onlyUpdateConfirm={true}
                                    style={{flex: 1, minHeight: 0, height: '100%'}}
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
    const [passwordInput, setPasswordInput] = React.useState('');
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const logViewerRef = React.useRef(null);
    const [summaryData, setSummaryData] = React.useState([]);
    const [outletLogs, setOutletLogs] = React.useState("ALL");
    const [activeTab, setActiveTab] = React.useState('api');
    const [complaintsData, setComplaintsData] = React.useState([]);
    const [complaintLoading, setComplaintLoading] = React.useState(false);
    const [complaintProgress, setComplaintProgress] = React.useState({ loaded: 0, total: null, done: false, error: null });
    const [complaintCardsLoaded, setComplaintCardsLoaded] = React.useState(0);

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
            setSummaryData(data.data || []);
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

    // Fetch complaints with streaming parsing per-object, incremental UI updates and caching in IndexedDB
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

    // start fetch on mount, but prefer cache
    useEffect(() => {
        fetchComplaints({ force: false });
    }, [fetchComplaints]);

    const fetchLogsByOutlet = async (outletId) => {
        setLoading(true);
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const endpoint =
                outletId === "ALL"
                    ? `${baseUri}/logs` // all outlet
                    : `${baseUri}/logs/${outletId}`;
            setOutletLogs(outletId);
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error("Gagal ambil logs");
            const data = await response.json();
            setWindowsLogsData(data.data || []);
        } catch (err) {
            console.error("Error fetch outlet logs:", err);
            setWindowsLogsData([]);
        }
        setLoading(false);
    };


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
        localStorage.setItem("selectedOutlet", outletLogs); // simpan setiap kali berubah
    }, [outletLogs]);

    useEffect(() => {
        if (!outletLogs) return;
        fetchLogsByOutlet(outletLogs);

        const interval = setInterval(() => {
            fetchLogsByOutlet(outletLogs);
        }, 10000);

        return () => clearInterval(interval);
    }, [outletLogs]);

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
            <div style={{
                minHeight: '100vh',
                width: '100vw',
                background: 'linear-gradient(120deg, #101014 0%, #18181c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <form
                    onSubmit={handleLogin}
                    style={{
                        minWidth: 350,
                        maxWidth: 400,
                        padding: '2.5rem 2rem',
                        borderRadius: 18,
                        background: 'rgba(30, 30, 35, 0.55)',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 18,
                        alignItems: 'center',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 18,
                            background: 'rgba(255,255,255,0.10)',
                            border: '2px solid rgba(255,255,255,0.45)',
                            boxShadow: '0 2px 12px #0006',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 10,
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                        }}>
                            <img
                                src="/favicon.ico"
                                alt="Logo"
                                style={{ width: 38, height: 38, borderRadius: 10, filter: 'drop-shadow(0 2px 8px #0008)' }}
                            />
                        </div>
                        <h3 style={{
                            marginBottom: 0,
                            textAlign: 'center',
                            fontWeight: 700,
                            letterSpacing: 1,
                            fontSize: 22,
                            color: '#fff',
                            textShadow: '0 2px 8px #0008',
                        }}>
                            Auth Logs Dastrevas x GASPOLL
                        </h3>
                    </div>
                    <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Masukkan password Access"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        style={{
                            background: 'rgba(20,20,25,0.7)',
                            color: '#fff',
                            border: '1px solid #333',
                            borderRadius: 8,
                            padding: '0.75rem 1rem',
                            fontSize: 16,
                            textAlign: 'center',
                        }}
                        // Inline placeholder color for React
                        onFocus={e => e.target.style.setProperty('color', '#fff', 'important')}
                    />
                    <style>{`
                        input::placeholder {
                            color: #fff !important;
                            opacity: 1;
                        }
                    `}</style>
                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                        style={{
                            background: 'rgba(0,0,0,0.7)',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 16,
                            letterSpacing: 1,
                            boxShadow: '0 2px 8px #0006',
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    // Modern tab layout
    const ModernTabs = require('../components/ModernTabs').default;
    return (
        <div className="container-fluid px-0 py-0 bg-dark text-light" style={{minHeight: '100vh'}}>
            <div className="d-flex flex-column align-items-center w-100" style={{paddingTop: 32}}>
                <ModernTabs
                    tabs={[
                        {
                            key: 'api',
                            label: 'API Logs',
                            content: (
                                <div className="p-3">
                                    <h5 className="mb-3 text-center">API Regular Logs</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {logFiles.map(fileName => (
                                            <LogFileButton
                                                key={fileName}
                                                fileName={fileName}
                                                onClick={() => readLogFile(fileName, false)}
                                            />
                                        ))}
                                    </div>
                                    <div ref={logViewerRef} style={{background: '#222', borderRadius: 8, padding: 16, minHeight: 250}}>
                                        <LogViewer logs={currentLogs} />
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: 'pm2',
                            label: 'PM2 Logs',
                            content: (
                                <div className="p-3">
                                    <h5 className="mb-3 text-center">PM2 Gaspoll Logs</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {pm2Logs.map(fileName => (
                                            <LogFileButton
                                                key={fileName}
                                                fileName={fileName}
                                                onClick={() => readLogFile(fileName, true)}
                                            />
                                        ))}
                                    </div>
                                    <div ref={logViewerRef} style={{background: '#222', borderRadius: 8, padding: 16, minHeight: 250}}>
                                        <LogViewer logs={currentLogs} />
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: 'windows',
                            label: 'Windows Logs',
                            content: (
                                <div className="p-3" style={{width: '100%', minHeight: 400, display: 'flex', flexDirection: 'column'}}>
                                    <WindowsSubTabs
                                        summaryData={summaryData}
                                        fetchLogsByOutlet={fetchLogsByOutlet}
                                        visibleFields={visibleFields}
                                        setVisibleFields={setVisibleFields}
                                        windowsLogsData={windowsLogsData}
                                        loading={loading}
                                    />
                                </div>
                            )
                        },
                        {
                            key: 'complaints',
                            label: 'Complaint Report',
                            content: (
                                <div className="p-0" style={{width: '100%', height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                                    {/* Lazy load component to keep bundle small */}
                                    <React.Suspense fallback={<div className="p-3">Loading complaint UI...</div>}>
                                        {/* Import dynamically to avoid SSR issues */}
                                        {typeof window !== 'undefined' && (() => {
                                            const C = require('../components/ComplaintReport').default;
                                            return (
                                                <C
                                                    complaints={complaintsData}
                                                    loading={complaintLoading}
                                                    onRefetch={() => fetchComplaints({ force: true })}
                                                    progress={complaintProgress}
                                                    cardsLoaded={complaintCardsLoaded}
                                                />
                                            );
                                        })()}
                                    </React.Suspense>
                                </div>
                            )
                        },
                        {
                            key: 'docs',
                            label: 'API Docs',
                            content: (
                                <div className="p-0" style={{width: '100%', height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                                    <iframe
                                        src={process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:3001/api-docs'}
                                        style={{width: '100%', height: '100%', border: 'none', borderRadius: 8, background: '#18181b', overflow: 'auto'}}
                                        title="API Documentation"
                                        scrolling="yes"
                                    />
                                </div>
                            )
                        }
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                />
                {/* Floating progress snackbar for complaint fetch */}
                {(!complaintProgress.done || complaintProgress.loaded > 0) && (
                    <div style={{position: 'fixed', right: 16, bottom: 16, zIndex: 1200}}>
                        <div className="badge bg-dark text-light shadow-sm" style={{padding: '10px 14px', border: '1px solid rgba(255,255,255,0.04)'}}>
                            <div style={{fontSize: 12}}>
                                {complaintProgress.error ? (
                                    <span style={{color: '#fca5a5'}}>Error: {complaintProgress.error}</span>
                                ) : (
                                    <>
                                        <strong>Complaint fetch</strong>
                                        <div style={{fontSize: 11, color: '#9ca3af'}}>
                                            {complaintProgress.loaded ? `${Math.round(complaintProgress.loaded/1024)} KB` : '0 KB'}
                                            {complaintProgress.total ? ` / ${Math.round(complaintProgress.total/1024)} KB` : ''}
                                            {complaintProgress.total ? ` (${Math.round((complaintProgress.loaded/complaintProgress.total)*100)}%)` : ''}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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