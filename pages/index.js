import fs from 'fs';
import path from 'path';
import React from 'react';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles }) => {
    const [logs, setLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    
    const readLogFile = async (fileName) => {
        setLoading(true);
        const response = await fetch(`/logs/${fileName}`);
        const data = await response.text();
        setLogs(data.split('\n'));
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center">Sync Logs</h3>
                    <div className="d-flex flex-column align-items-center mb-3">
                        {logFiles.sync.length > 0 ? (
                            logFiles.sync.map(fileName => (
                                <LogFileButton 
                                    key={fileName} 
                                    fileName={fileName} 
                                    onClick={() => readLogFile(fileName)} 
                                />
                            ))
                        ) : (
                            <div className="text-muted">Tidak ada file log sync ditemukan.</div>
                        )}
                    </div>
                    {loading && 
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                    <LogViewer logs={logs} />
                </div>
                
                <div className="col-md-6">
                    <h3 className="text-center">Error Logs</h3>
                    <div className="d-flex flex-column align-items-center mb-3">
                        {logFiles.error.length > 0 ? (
                            logFiles.error.map(fileName => (
                                <LogFileButton 
                                    key={fileName} 
                                    fileName={fileName} 
                                    onClick={() => readLogFile(fileName)} 
                                />
                            ))
                        ) : (
                            <div className="text-muted">Tidak ada file log error ditemukan.</div>
                        )}
                    </div>
                    {loading && 
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                    <LogViewer logs={logs} />
                </div>
            </div>
        </div>
    );
};

// Static Generation
export async function getStaticProps() {
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs');

    try {
        const files = fs.readdirSync(logsDirectory);
        const syncFiles = files.filter(file => file.startsWith('sync-'));
        const errorFiles = files.filter(file => file.startsWith('error-'));

        return {
            props: {
                logFiles: {
                    sync: syncFiles,
                    error: errorFiles,
                },
            },
        };
    } catch (error) {
        console.error("Error reading logs folder:", error);
        return {
            props: {
                logFiles: {
                    sync: [],
                    error: [],
                },
            },
        };
    }
}

export default Home;