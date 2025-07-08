import fs from 'fs';
import path from 'path';
import React from 'react';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles }) => {
    const [syncLogs, setSyncLogs] = React.useState('');
    const [errorLogs, setErrorLogs] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const syncLogRef = React.useRef(null);
    const errorLogRef = React.useRef(null);

    const readLogFile = async (fileType, fileName) => {
        setLoading(true);
        const response = await fetch(`/logs/${fileName}`);
        const data = await response.text();
        
        if (fileType === 'sync') {
            setSyncLogs(prevLogs => prevLogs + "\n" + data);
            if (syncLogRef.current) {
                syncLogRef.current.scrollTop = syncLogRef.current.scrollHeight;
            }
        } else {
            setErrorLogs(prevLogs => prevLogs + "\n" + data);
            if (errorLogRef.current) {
                errorLogRef.current.scrollTop = errorLogRef.current.scrollHeight;
            }
        }

        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center">API Logs file</h3>
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
                    {loading && 
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                    <div 
                        ref={syncLogRef}
                        style={{ 
                            height: '300px', 
                            border: '1px solid #ccc', 
                            overflowY: 'auto', 
                            padding: '10px', 
                            marginBottom: '20px'
                        }}>
                        <LogViewer logs={syncLogs.split('\n')} />
                    </div>
                    <div 
                        ref={errorLogRef}
                        style={{ 
                            height: '300px', 
                            border: '1px solid #ccc', 
                            overflowY: 'auto', 
                            padding: '10px' 
                        }}>
                        <LogViewer logs={errorLogs.split('\n')} />
                    </div>
                </div>
                <div className="col-md-6">
                    <h3 className="text-center">PM2 API Logs</h3>
                    <div className="d-flex flex-column align-items-center mb-3">
                        <LogFileButton 
                            fileName="gaspol-api-error.log" 
                            onClick={() => readLogFile('error', 'gaspol-api-error.log')} 
                        />
                        <LogFileButton 
                            fileName="gaspol-api-out.log" 
                            onClick={() => readLogFile('sync', 'gaspol-api-out.log')} 
                        />
                    </div>
                    {loading && 
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                    <div 
                        ref={syncLogRef}
                        style={{ 
                            height: '300px', 
                            border: '1px solid #ccc', 
                            overflowY: 'auto', 
                            padding: '10px' 
                        }}>
                        <LogViewer logs={syncLogs.split('\n')} />
                    </div>
                    <div 
                        ref={errorLogRef}
                        style={{ 
                            height: '300px', 
                            border: '1px solid #ccc', 
                            overflowY: 'auto', 
                            padding: '10px' 
                        }}>
                        <LogViewer logs={errorLogs.split('\n')} />
                    </div>
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