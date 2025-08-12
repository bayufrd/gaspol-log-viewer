import fs from 'fs';
import path from 'path';
import React from 'react';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles, pm2Logs }) => {
    const [currentLogs, setCurrentLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const logViewerRef = React.useRef(null);

    const readLogFile = async (filePath) => {
        setLoading(true);
        const response = await fetch(filePath);
        const data = await response.text();

        const lines = data.split('\n');
        const last100Lines = lines.slice(-100);
        setCurrentLogs(last100Lines);

        setLoading(false);

        if (logViewerRef.current) {
            logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
        }
    };

    return (
        <div className="container-fluid px-4 py-3 bg-dark text-light">
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card bg-secondary text-white shadow-lg h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="card-title mb-0 text-center">PM2 Logs</h5>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center">
                            {pm2Logs.map(fileName => (
                                <LogFileButton
                                    key={fileName}
                                    fileName={fileName}
                                    onClick={() => readLogFile(`/pm2logs/${fileName}`)}
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

                <div className="col-md-8">
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
        </div>
    );
};

export async function getStaticProps() {
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs');

    // Buat direktori jika tidak ada
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory, { recursive: true });
    }

    try {
        const logFiles = fs.readdirSync(logsDirectory);
        const pm2LogFiles = [
            'gaspol-api-error.log',
            'gaspol-api-out.log'
        ];

        return {
            props: {
                logFiles: logFiles,
                pm2Logs: pm2LogFiles,
            },
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
