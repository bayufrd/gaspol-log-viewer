import fs from 'fs';
import path from 'path';
import React from 'react';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles, pm2Logs }) => {
    const [currentLogs, setCurrentLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // Function to read log files, keep the last 100 lines and auto-scroll
    const readLogFile = async (filePath) => {
        setLoading(true);
        const response = await fetch(filePath);
        const data = await response.text();

        // Split logs into lines and get the last 100
        const lines = data.split('\n');
        const last100Lines = lines.slice(-100); // Get only the last 100 lines
        setCurrentLogs(last100Lines);

        setLoading(false);

        // Auto-scroll to the bottom of the log viewer
        if (logViewerRef.current) {
            logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center">PM2 Logs</h3>
                    <div className="d-flex flex-column align-items-center mb-3">
                        <LogFileButton
                            fileName="gaspol-api-out.log"
                            onClick={() => readLogFile('/pm2logs/gaspol-api-out.log')}
                        />
                        <LogFileButton
                            fileName="gaspol-api-error.log"
                            onClick={() => readLogFile('/pm2logs/gaspol-api-error.log')}
                        />
                    </div>
                    {loading &&
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </div>

                <div className="col-md-6">
                    <h3 className="text-center">Log Files</h3>
                    <div
                        className="d-flex flex-column align-items-center mb-3"
                        style={{
                            maxHeight: '115px', // Set a fixed max height
                            overflowY: 'auto',   // Enable vertical scrolling
                            border: '1px solid #ccc', // Set a border
                            padding: '10px',      // Add padding for aesthetics
                            width: '100%'         // Full width of the parent
                        }}>
                        {logFiles.length > 0 ? (
                            logFiles.map(fileName => (
                                <LogFileButton
                                    key={fileName}
                                    fileName={fileName}
                                    onClick={() => readLogFile(`/logs/${fileName}`)}
                                />
                            ))
                        ) : (
                            <div className="text-muted">Tidak ada file log ditemukan.</div>
                        )}
                    </div>
                    {loading &&
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* Footer Log Viewer that spans the full width */}
            <div
                style={{
                    height: '300px',
                    border: '1px solid #ccc',
                    overflowY: 'auto',
                    padding: '10px',
                    marginTop: '20px' // Space above the footer log viewer
                }}>
                <LogViewer logs={currentLogs} />
            </div>
        </div>
    );
};

// Static Generation
export async function getStaticProps() {
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs');
    const pm2LogsDirectory = path.join(process.cwd(), 'pm2logs');

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