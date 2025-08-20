import fs from 'fs';
import path from 'path';
import React from 'react';
import Link from 'next/link';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles, pm2Logs }) => {
    const [currentLogs, setCurrentLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const logViewerRef = React.useRef(null);

    const readLogFile = async (filePath, ispm2Log = false) => {
        setLoading(true);
        try {
            const fullPath = ispm2Log ? `/pm2logs/${filePath}` : `/logs/${filePath}`;
            const response = await fetch(fullPath);
            
            if (!response.ok) {
                throw new Error('File not found');
            }
            
            const data = await response.text();
            const lines = data.split('\n');
            const last100Lines = lines.slice(-100);
            setCurrentLogs(last100Lines);
        } catch (error) {
            console.error('Error reading log file:', error);
            setCurrentLogs([`Error membaca file: ${error.message}`]);
        }

        setLoading(false);

        if (logViewerRef.current) {
            logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
        }
    };

    return (
        <div className="container-fluid px-4 py-3 bg-dark text-light">
              {/* Navigasi ke Swagger dengan desain tombol yang lebih menarik */}
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <Link href="/apiDocs" className="btn-swagger-custom">
                        <div className="btn-swagger-content">
                            <i className="bi bi-book me-2"></i>
                            <span>Lihat Dokumentasi API</span>
                            <div className="btn-swagger-overlay"></div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="row g-4">
                {/* Kolom PM2 Logs */}
                <div className="col-md-4">
                    <div className="card bg-secondary text-white shadow-lg h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="card-title mb-0 text-center">Regular Logs</h5>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center">
                            {pm2Logs.map(fileName => (
                                <LogFileButton
                                    key={fileName}
                                    fileName={fileName}
                                    onClick={() => readLogFile(fileName, true)}
                                />
                            ))}
                            {loading && (
                                <div className="text-center mt-3">
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kolom Regular Logs */}
                <div className="col-md-4">
                    <div className="card bg-secondary text-white shadow-lg h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="card-title mb-0 text-center">PM2 Logs</h5>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center">
                            {logFiles.map(fileName => (
                                <LogFileButton
                                    key={fileName}
                                    fileName={fileName}
                                    onClick={() => readLogFile(fileName, false)}
                                />
                            ))}
                            {loading && (
                                <div className="text-center mt-3">
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Log Viewer */}
                <div className="col-md-4">
                    <div className="card bg-secondary text-white shadow-lg h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="card-title mb-0 text-center">Log Viewer</h5>
                        </div>
                        <div
                            ref={logViewerRef}
                            className="card-body log-viewer-container overflow-auto"
                            style={{
                                maxHeight: '600px',
                                backgroundColor: '#2c2c2c',
                                color: '#e0e0e0'
                            }}
                        >
                            <LogViewer logs={currentLogs} />
                        </div>
                    </div>
                </div>
            </div>


            {/* Style tetap sama */}
            {/* Tambahkan style kustom */}
            <style jsx>{`  
                .btn-swagger-custom {  
                    position: relative;  
                    display: inline-block;  
                    text-decoration: none;  
                    overflow: hidden;  
                    transition: all 0.3s ease;  
                    border-radius: 10px;  
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);  
                }  

                .btn-swagger-content {  
                    position: relative;  
                    display: flex;  
                    align-items: center;  
                    justify-content: center;  
                    padding: 12px 24px;  
                    background-color: #1e2229; /* Warna gelap yang elegan */  
                    color: #ffffff;  
                    font-weight: 600;  
                    border: 2px solid rgba(255, 255, 255, 0.1);  
                    z-index: 1;  
                    transition: all 0.3s ease;  
                }  

                .btn-swagger-custom:hover .btn-swagger-content {  
                    background-color: #2c3340; /* Sedikit terang saat hover */  
                    transform: translateY(-3px);  
                }  

                .btn-swagger-overlay {  
                    position: absolute;  
                    top: 0;  
                    left: -100%;  
                    width: 100%;  
                    height: 100%;  
                    background: linear-gradient(  
                        120deg,   
                        transparent,   
                        rgba(255,255,255,0.1),   
                        transparent  
                    );  
                    transition: all 0.5s ease;  
                }  

                .btn-swagger-custom:hover .btn-swagger-overlay {  
                    left: 100%;  
                }  

                .btn-swagger-custom i {  
                    margin-right: 8px;  
                    font-size: 1.2em;  
                }  

                @media (max-width: 576px) {  
                    .btn-swagger-content {  
                        padding: 10px 18px;  
                        font-size: 0.9em;  
                    }  
                }  
            `}</style>
        </div>
    );
};

export async function getStaticProps() {
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs');
    const pm2LogsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'pm2logs');

    // Buat direktori jika tidak ada
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory, { recursive: true });
    }

    if (!fs.existsSync(pm2LogsDirectory)) {
        fs.mkdirSync(pm2LogsDirectory, { recursive: true });
    }

    try {
        const logFiles = fs.readdirSync(logsDirectory);
        const pm2LogFiles = fs.readdirSync(pm2LogsDirectory);

        return {
            props: {
                logFiles: logFiles,
                pm2Logs: pm2LogFiles,
            },
            revalidate: 10 // Opsional: untuk ISR (Incremental Static Regeneration)
        };
    } catch (error) {
        console.error("Error reading logs folder:", error);
        return {
            props: {
                logFiles: [],
                pm2Logs: [],
            },
        };
    }
}

export default Home;