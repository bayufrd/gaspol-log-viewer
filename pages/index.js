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
                        <div style={{width: '100%', minHeight: '65vh', maxHeight: '80vh', overflowY: 'auto'}}>
                            <h5 className="mb-3 text-center">Log Client Windows</h5>
                            <div className="d-flex flex-wrap gap-2 mb-3">
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
                            <div className="mb-2 d-flex flex-wrap gap-3">
                                {Object.keys(visibleFields).map((field) => (
                                    <label key={field} className="text-light me-3">
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
                            <LogWindowsViewer
                                windowsLogsData={windowsLogsData}
                                loading={loading}
                                visibleFields={visibleFields}
                            />
                        </div>
                    )
                },
                {
                    key: 'update',
                    label: 'Log Update Confirm Client Windows',
                    content: (
                        <div style={{width: '100%', minHeight: '65vh', maxHeight: '80vh', overflowY: 'auto'}}>
                            <h5 className="mb-3 text-center">Log Update Confirm Client Windows</h5>
                            <LogWindowsViewer
                                windowsLogsData={[]}
                                loading={loading}
                                visibleFields={visibleFields}
                                onlyUpdateConfirm={true}
                            />
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
            setIsAuthenticated(true);
        } else {
            alert('Password salah!');
            setPasswordInput('');
        }
    };

    // Jika belum login, tampilkan form login
    if (!isAuthenticated) {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <form onSubmit={handleLogin} className="p-4 border rounded bg-dark text-light shadow-lg" style={{minWidth: 350}}>
                    <h3 className="mb-3 text-center">Auth Logs Dastrevas x GASPOLL</h3>
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Masukkan password Access"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <button className="btn btn-primary w-100" type="submit">Login</button>
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