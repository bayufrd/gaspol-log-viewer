import fs from 'fs';
import path from 'path';
import React from 'react';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles }) => {
    const [syncLogs, setSyncLogs] = React.useState([]);
    const [errorLogs, setErrorLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    
    const readLogFile = async (fileType, fileName) => {
        setLoading(true);
        const response = await fetch(`/logs/${fileName}`);
        const data = await response.text();
        if (fileType === 'sync') {
            setSyncLogs(data.split('\n'));
        } else {
            setErrorLogs(data.split('\n'));
        }
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
                                    onClick={() => readLogFile('sync', fileName)} 
                                />
                            ))
                        ) : (
                            <div className="text-muted">Tidak ada file log sync ditemukan.</div>
                        )}
                    </div>
                    {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                    <LogViewer logs={syncLogs} />
                </div>
                <div className="col-md-6">
                    <h3 className="text-center">Error Logs</h3>
                    <div className="d-flex flex-column align-items-center mb-3">
                        {logFiles.error.length > 0 ? (
                            logFiles.error.map(fileName => (
                                <LogFileButton 
                                    key={fileName} 
                                    fileName={fileName} 
                                    onClick={() => readLogFile('error', fileName)} 
                                />
                            ))
                        ) : (
                            <div className="text-muted">Tidak ada file log error ditemukan.</div>
                        )}
                    </div>
                    {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                    <LogViewer logs={errorLogs} />
                </div>
            </div>
        </div>
    );
};

// Static Generation
export async function getStaticProps() {
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs'); // Pastikan jalur ini benar

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
        console.error("Error membaca folder logs:", error);
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